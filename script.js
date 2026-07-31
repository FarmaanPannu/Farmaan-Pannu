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