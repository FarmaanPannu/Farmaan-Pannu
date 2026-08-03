function randomStylize(text) {
  const chars = text.toLowerCase().split("");

  const letterIndexes = chars
    .map((char, index) => /[a-z]/i.test(char) ? index : -1)
    .filter(index => index !== -1);

  // Randomly shuffle the letter positions
  for (let i = letterIndexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [letterIndexes[i], letterIndexes[j]] =
      [letterIndexes[j], letterIndexes[i]];
  }

  // Capitalize between 3 and 5 letters
  const numberOfCapitals = Math.floor(Math.random() * 3) + 3;

  for (let i = 0; i < numberOfCapitals; i++) {
    const index = letterIndexes[i];
    chars[index] = chars[index].toUpperCase();
  }

  return chars.join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");

  if (!header) return;

  const originalText = header.textContent.trim();

  setInterval(() => {
    header.textContent = randomStylize(originalText);
  }, 125);
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener("DOMContentLoaded", async () => {

    const links = [...document.querySelectorAll(".pages a")];

    const items = links.map(link => {
        const match = link.textContent.match(/^(\d+)(.*)$/);

        return {
            link,
            target: match[1],
            suffix: match[2],
            digits: match[1].split("").map(() => Math.floor(Math.random() * 10))
        };
    });

    // Render helper
    function render(item) {
        item.link.textContent = item.digits.join("") + item.suffix;
    }

    // EVERY number spins
    const intervals = items.map(item =>
        setInterval(() => {
            item.digits = item.digits.map(() => Math.floor(Math.random() * 10));
            render(item);
        }, 45)
    );

    await wait(500);

    // Lock menu items one after another
    for (let i = 0; i < items.length; i++) {

        const item = items[i];

        clearInterval(intervals[i]); // stop ONLY this one

        // Lock first digit
        while (item.digits[0] !== Number(item.target[0])) {
            item.digits[0] = (item.digits[0] + 1) % 10;
            render(item);
            await wait(50);
        }

        await wait(75);

        // Lock second digit
        while (item.digits[1] !== Number(item.target[1])) {
            item.digits[1] = (item.digits[1] + 1) % 10;
            render(item);
            await wait(50);
        }

        // Hold permanently
        item.digits = item.target.split("").map(Number);
        render(item);

        await wait(200);
    }
});


// ========================================
// Mini Tetris Page Transition
// ========================================

const tetrisTransition = document.querySelector(".tetris-transition");
const tetrisBoard = document.querySelector(".tetris-board");

const CELL_SIZE = 36;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 14;

const tetrominoes = {
    I: [
        [1, 1, 1, 1]
    ],

    O: [
        [1, 1],
        [1, 1]
    ],

    T: [
        [1, 1, 1],
        [0, 1, 0]
    ],

    L: [
        [1, 0],
        [1, 0],
        [1, 1]
    ],

    J: [
        [0, 1],
        [0, 1],
        [1, 1]
    ],

    S: [
        [0, 1, 1],
        [1, 1, 0]
    ],

    Z: [
        [1, 1, 0],
        [0, 1, 1]
    ]
};

const pieceColors = [
    "#d95f59",
    "#4e79a7",
    "#59a14f",
    "#f28e2b",
    "#af7aa1",
    "#edc948",
    "#76b7b2"
];

function positionTetrisBox() {
    tetrisTransition.style.left = "50%";
    tetrisTransition.style.top = "50%";
    tetrisTransition.style.transform = "translate(-50%, -50%)";
}

function createTetromino(shape, color, column, landingRow, delay) {
    const piece = document.createElement("div");

    piece.className = "tetris-piece";

    const pieceWidth = shape[0].length;
    const pieceHeight = shape.length;

    piece.style.gridTemplateColumns =
        `repeat(${pieceWidth}, ${CELL_SIZE}px)`;

    piece.style.gridTemplateRows =
        `repeat(${pieceHeight}, ${CELL_SIZE}px)`;

    piece.style.left = `${column * CELL_SIZE}px`;
    piece.style.top = `${-pieceHeight * CELL_SIZE}px`;

    const landingPosition = landingRow * CELL_SIZE;

    piece.style.setProperty(
        "--fall-distance",
        `${landingPosition + pieceHeight * CELL_SIZE}px`
    );

    piece.style.setProperty("--delay", `${delay}ms`);
    piece.style.setProperty("--piece-color", color);

    shape.forEach(row => {
        row.forEach(cellValue => {
            const cell = document.createElement("span");

            cell.className = cellValue
                ? "tetris-cell"
                : "tetris-cell empty";

            piece.appendChild(cell);
        });
    });

    return piece;
}

function addPieceToBoard(board, shape, column, row) {
    shape.forEach((shapeRow, rowOffset) => {
        shapeRow.forEach((cell, columnOffset) => {
            if (cell === 0) {
                return;
            }

            const boardRow = row + rowOffset;
            const boardColumn = column + columnOffset;

            if (boardRow >= 0) {
                board[boardRow][boardColumn] = 1;
            }
        });
    });
}

function canPlacePiece(board, shape, column, row) {
    for (let shapeRow = 0; shapeRow < shape.length; shapeRow++) {
        for (
            let shapeColumn = 0;
            shapeColumn < shape[shapeRow].length;
            shapeColumn++
        ) {
            if (shape[shapeRow][shapeColumn] === 0) {
                continue;
            }

            const boardColumn = column + shapeColumn;
            const boardRow = row + shapeRow;

            if (
                boardColumn < 0 ||
                boardColumn >= BOARD_WIDTH ||
                boardRow >= BOARD_HEIGHT
            ) {
                return false;
            }

            if (
                boardRow >= 0 &&
                board[boardRow][boardColumn] !== 0
            ) {
                return false;
            }
        }
    }

    return true;
}

function addPieceToBoard(board, shape, column, row) {
    shape.forEach((shapeRow, rowOffset) => {
        shapeRow.forEach((cell, columnOffset) => {
            if (cell === 0) {
                return;
            }

            const boardRow = row + rowOffset;
            const boardColumn = column + columnOffset;

            if (boardRow >= 0) {
                board[boardRow][boardColumn] = 1;
            }
        });
    });
}

function runTetrisAnimation() {
    tetrisBoard.innerHTML = "";

    const board = Array.from(
        { length: BOARD_HEIGHT },
        () => Array(BOARD_WIDTH).fill(0)
    );

    const sequence = [
        { type: "L", column: 0 },
        { type: "O", column: 2 },
        { type: "T", column: 4 },
        { type: "I", column: 6 },
        { type: "S", column: 1 },
        { type: "J", column: 8 }
    ];

    sequence.forEach((item, index) => {
        const shape = tetrominoes[item.type];
        const color = pieceColors[index % pieceColors.length];

        let landingRow = -shape.length;

        while (
            canPlacePiece(
                board,
                shape,
                item.column,
                landingRow + 1
            )
        ) {
            landingRow++;
        }

        addPieceToBoard(
            board,
            shape,
            item.column,
            landingRow
        );

        const piece = createTetromino(
            shape,
            color,
            item.column,
            landingRow,
            index * 170
        );

        tetrisBoard.appendChild(piece);
    });
}

if (tetrisTransition && tetrisBoard) {
    document.querySelectorAll("a.link").forEach(link => {
        link.addEventListener("click", event => {
            const destination = link.getAttribute("href");

            if (!destination || destination.startsWith("#")) {
                return;
            }

            event.preventDefault();

            document.body.classList.add("is-transitioning");

            positionTetrisBox();
            runTetrisAnimation();

            tetrisTransition.classList.add("active");

            window.setTimeout(() => {
                window.location.href = destination;
            }, 1800);
        });
    });
}