// --- Game Setup ---
const beats = { rock: "scissors", paper: "rock", scissors: "paper" };

let playerScore = 0;
let computerScore = 0;
let winningScore = 5; // default "best of 5"
let gameOver = false;

const youScoreEl = document.getElementById("youScore");
const cpuScoreEl = document.getElementById("cpuScore");
const statusHead = document.getElementById("statusHead");
const miniStatus = document.getElementById("miniStatus");
const firstToEl = document.getElementById("firstTo");

const youMoveEl = document.getElementById("youMove");
const cpuMoveEl = document.getElementById("cpuMove");

const bestOfSel = document.getElementById("bestOf");
const soundToggle = document.getElementById("soundToggle");
const resetBtn = document.getElementById("resetBtn");
const historyList = document.getElementById("historyList");

const btnRock = document.getElementById("rockBtn");
const btnPaper = document.getElementById("paperBtn");
const btnScissors = document.getElementById("scissorsBtn");

// sounds (tiny silent placeholders in HTML; swap with your own if you like)
const sWin  = document.getElementById("sWin");
const sLose = document.getElementById("sLose");
const sTie  = document.getElementById("sTie");

// --- Utilities ---
function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getComputerChoice() {
  return randChoice(Object.keys(beats));
}

function formatMove(m) {
  return m === "rock" ? "✊ Rock" : m === "paper" ? "✋ Paper" : "✌️ Scissors";
}

function playSound(type) {
  if (!soundToggle.checked) return;
  const map = { win: sWin, lose: sLose, tie: sTie };
  const el = map[type];
  if (el) {
    el.currentTime = 0;
    el.play().catch(() => {});
  }
}

function updateScoreboard() {
  youScoreEl.textContent = playerScore;
  cpuScoreEl.textContent = computerScore;
}

function setStatus(text, sub = null) {
  statusHead.textContent = text;
  if (sub !== null) miniStatus.innerHTML = sub;
}

function flash(el, cls) {
  el.classList.remove("flash-win", "flash-lose", "flash-tie", "pulse");
  void el.offsetWidth; // reflow
  el.classList.add(cls, "pulse");
  setTimeout(() => el.classList.remove(cls), 450);
}

function addHistoryLine(result, player, cpu, roundNum) {
  const li = document.createElement("li");
  const badge =
    result === "win"
      ? "✅"
      : result === "lose"
      ? "❌"
      : "⟲";
  li.textContent = `R${roundNum}: ${badge} You ${formatMove(
    player
  )} vs CPU ${formatMove(cpu)}`;
  historyList.prepend(li);
  // Keep only last 10
  while (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

function burstConfetti() {
  const count = 36;
  const w = window.innerWidth;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * w + "px";
    p.style.background = `hsl(${Math.random() * 360}, 90%, 60%)`;
    const fall = 600 + Math.random() * 800;
    const drift = (Math.random() - 0.5) * 200;
    p.animate(
      [
        { transform: "translate(0, -10px) rotate(0deg)", opacity: 1 },
        { transform: `translate(${drift}px, ${fall}px) rotate(${720 *
            Math.random()}deg)`, opacity: 0.1 }
      ],
      { duration: 1200 + Math.random() * 900, easing: "cubic-bezier(.2,.7,.2,1)" }
    ).onfinish = () => p.remove();
    document.body.appendChild(p);
  }
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  gameOver = false;
  updateScoreboard();
  youMoveEl.textContent = "—";
  cpuMoveEl.textContent = "—";
  setStatus("Make your move!", `First to <span id="firstTo">${winningScore}</span> wins.`);
  // clear history
  historyList.innerHTML = "";
}

// --- Game Logic ---
let roundsPlayed = 0;

function playRound(playerChoice) {
  if (gameOver) return;
  const cpuChoice = getComputerChoice();
  roundsPlayed++;

  youMoveEl.textContent = formatMove(playerChoice);
  cpuMoveEl.textContent = formatMove(cpuChoice);

  if (playerChoice === cpuChoice) {
    setStatus("Tie round!", `First to <span>${winningScore}</span> wins.`);
    addHistoryLine("tie", playerChoice, cpuChoice, roundsPlayed);
    playSound("tie");
    flash(youMoveEl, "flash-tie");
    flash(cpuMoveEl, "flash-tie");
    return;
  }

  if (beats[playerChoice] === cpuChoice) {
    playerScore++;
    updateScoreboard();
    setStatus("You win the round!", `First to <span>${winningScore}</span> wins.`);
    addHistoryLine("win", playerChoice, cpuChoice, roundsPlayed);
    playSound("win");
    flash(youMoveEl, "flash-win");
  } else {
    computerScore++;
    updateScoreboard();
    setStatus("CPU wins the round!", `First to <span>${winningScore}</span> wins.`);
    addHistoryLine("lose", playerChoice, cpuChoice, roundsPlayed);
    playSound("lose");
    flash(cpuMoveEl, "flash-lose");
  }

  // Check game end
  if (playerScore >= winningScore || computerScore >= winningScore) {
    gameOver = true;
    if (playerScore > computerScore) {
      setStatus(`🎉 You won the game!`, `Final — You: <strong>${playerScore}</strong> • CPU: <strong>${computerScore}</strong>`);
      burstConfetti();
    } else {
      setStatus(`💀 CPU won the game!`, `Final — You: <strong>${playerScore}</strong> • CPU: <strong>${computerScore}</strong>`);
    }
  }
}

// --- Events ---
document.querySelectorAll(".btn.move").forEach((btn) => {
  btn.addEventListener("click", () => playRound(btn.dataset.move));
});

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "r") btnRock.click();
  if (key === "p") btnPaper.click();
  if (key === "s") btnScissors.click();
  if (key === "n") resetBtn.click();
});

bestOfSel.addEventListener("change", () => {
  const v = Number(bestOfSel.value);
  // "Best of X" -> first to (X+1)/2
  winningScore = (v + 1) >> 1;
  firstToEl.textContent = winningScore;
  // If game already over, reset to start a new one with new target
  resetGame();
});

resetBtn.addEventListener("click", () => {
  roundsPlayed = 0;
  resetGame();
});

// --- Init ---
(function init() {
  // sync best-of default
  const v = Number(bestOfSel.value);
  winningScore = (v + 1) >> 1;
  firstToEl.textContent = winningScore;
  resetGame();
})();
