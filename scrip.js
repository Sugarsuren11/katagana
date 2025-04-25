const katakana = {
  "ア": "a", "イ": "i", "ウ": "u", "エ": "e", "オ": "o",
  "カ": "ka", "キ": "ki", "ク": "ku", "ケ": "ke", "コ": "ko",
  "サ": "sa", "シ": "shi", "ス": "su", "セ": "se", "ソ": "so",
  "タ": "ta", "チ": "chi", "ツ": "tsu", "テ": "te", "ト": "to",
  "ナ": "na", "ニ": "ni", "ヌ": "nu", "ネ": "ne", "ノ": "no",
  "ハ": "ha", "ヒ": "hi", "フ": "fu", "ヘ": "he", "ホ": "ho",
  "マ": "ma", "ミ": "mi", "ム": "mu", "メ": "me", "モ": "mo",
  "ヤ": "ya", "ユ": "yu", "ヨ": "yo",
  "ラ": "ra", "リ": "ri", "ル": "ru", "レ": "re", "ロ": "ro",
  "ワ": "wa", "ヲ": "wo", "ン": "n"
};

const kanaKeys = Object.keys(katakana);
const kanaHistory = {};
kanaKeys.forEach(k => kanaHistory[k] = 0);

let score = 0;
let timerTimeout;
let currentKana = "";

const kanaEl = document.getElementById("kana");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const choicesDiv = document.getElementById("choices");
const progressBar = document.getElementById("progressBar");

function startVisualTimer() {
  progressBar.style.animation = "none";
  void progressBar.offsetWidth;
  progressBar.style.animation = "shrink 60s linear forwards";

  clearTimeout(timerTimeout);
  timerTimeout = setTimeout(() => {
    showAnswer(false);
  }, 60000);
}

function pickKana() {
  const availableKana = kanaKeys.filter(k => kanaHistory[k] < 3);
  if (availableKana.length === 0) {
    feedbackEl.textContent = "🎉 Та бүх үсгийг 3 удаа давтлаа!";
    kanaEl.textContent = "-";
    choicesDiv.innerHTML = "";
    return;
  }

  currentKana = availableKana[Math.floor(Math.random() * availableKana.length)];
  kanaHistory[currentKana]++;
  kanaEl.textContent = currentKana;
  feedbackEl.textContent = "";
  showChoices();
  startVisualTimer();
}

function showChoices() {
  const correct = katakana[currentKana];
  const allValues = Object.values(katakana);
  const choices = new Set([correct]);
  while (choices.size < 4) {
    const rand = allValues[Math.floor(Math.random() * allValues.length)];
    choices.add(rand);
  }

  const shuffled = Array.from(choices).sort(() => Math.random() - 0.5);
  choicesDiv.innerHTML = "";

  shuffled.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    choicesDiv.appendChild(btn);
  });
}

function checkAnswer(input) {
  const correct = katakana[currentKana];
  if (input.trim().toLowerCase() === correct) {
    score++;
    scoreEl.textContent = `Оноо: ${score}`;
    pickKana();
  } else {
    showAnswer(false);
  }
}

function showAnswer() {
  clearTimeout(timerTimeout);
  progressBar.style.animation = "none";
  const correctAnswer = katakana[currentKana];
  feedbackEl.textContent = `❌ Буруу! Зөв хариулт: ${correctAnswer}`;
  setTimeout(() => {
    if (confirm("Дахин эхлэх үү?")) {
      score = 0;
      scoreEl.textContent = `Оноо: ${score}`;
      resetKanaHistory();
      pickKana();
    } else {
      feedbackEl.textContent = "Тоглоом дууссан 🎌";
      kanaEl.textContent = "-";
      choicesDiv.innerHTML = "";
    }
  }, 1000);
}

function resetKanaHistory() {
  for (let key in kanaHistory) {
    kanaHistory[key] = 0;
  }
}

pickKana();
