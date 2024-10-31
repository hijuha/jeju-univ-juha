const quotes = [
  "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
  "There is nothing more deceptive than an obvious fact.",
  "I ought to know by this time that when a fact appears to be opposed to along train of deductions it invariably proves to be capable of bearing some other interpretation.",
  "I never make exceptions. An exception disproves the rule.",
  "What one man can invent another can discover.",
  "Nothing clears up a case so much as stating it to another person.",
  "Education never ends, Watson. It is a series of lessons, with the greatest for the last.",
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();

const quoteElement = document.getElementById("quote");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const bestScoreElement = document.getElementById("best-score");

let bestScore = localStorage.getItem("bestScore");
bestScoreElement.textContent = bestScore ? bestScore : "-";

document.getElementById("start").addEventListener("click", startEvent);
document.getElementById("reset").addEventListener("click", resetEvent);

typedValueElement.addEventListener("input", inputText);

document.querySelector(".close").addEventListener("click", () => {
  modal.style.display = "none";
});

function startEvent() {
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];
  words = quote.split(" ");
  wordIndex = 0; // 초기화
  const spanWords = words.map(function (word) {
    return `<span>${word} </span>`;
  });

  quoteElement.innerHTML = spanWords.join("");
  quoteElement.childNodes[0].className = "highlight";
  messageElement.innerText = "";
  typedValueElement.value = "";
  typedValueElement.focus();
  startTime = new Date().getTime();
}

function resetEvent() {
  quoteElement.innerHTML = "";
  messageElement.innerText = "";
  words = [];
  typedValueElement.disabled = false;
  typedValueElement.value = "";
}

function inputText() {
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  typedValueElement.classList.add("typing-effect");

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    const elapsedTime = new Date().getTime() - startTime;
    showResult(elapsedTime);
    typedValueElement.disabled = true;
  } else if (typedValue.endsWith(" ") && typedValue.trim() === currentWord) {
    typedValueElement.value = "";
    wordIndex++;
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = "";
    }

    quoteElement.childNodes[wordIndex].className = "highlight";

    typedValueElement.classList.remove("incorrect-effect");
    typedValueElement.classList.add("correct-effect");
  } else if (currentWord.startsWith(typedValue)) {
    typedValueElement.className = "";
    typedValueElement.classList.remove("incorrect-effect");
    typedValueElement.classList.add("typing-effect");
  } else {
    typedValueElement.className = "error";
    typedValueElement.classList.remove("typing-effect");
    typedValueElement.classList.add("incorrect-effect");
  }

  setTimeout(() => {
    typedValueElement.classList.remove(
      "typing-effect",
      "correct-effect",
      "incorrect-effect"
    );
  }, 350);
}

function showResult(elapsedTime) {
  const latestTime = elapsedTime / 1000;
  const message = `축하! 당신의 기록은 ${latestTime} 초 입니다!`;
  modalMessage.innerText = message;
  modal.style.display = "block";

  if (!bestScore || latestTime < bestScore) {
    console.log("update");
    bestScore = latestTime;
    localStorage.setItem("bestScore", bestScore);
    bestScoreElement.textContent = bestScore;
  }
  console.log(bestScore);
}
