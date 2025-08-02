// Map moves to what they beat
const beats = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

let playerScore = 0;
let computerScore = 0;
const WINNING_SCORE = 5;

const statusHead = document.getElementById("status-head");
const moveDisplay = document.querySelector(".move-display");
const [playerMoveEl, computerMoveEl] = moveDisplay.querySelectorAll("h2");

const rockBtn = document.getElementById("rock-button");
const paperBtn = document.getElementById("paper-button");
const scissorsBtn = document.getElementById("scissors-button");

// Initialize button labels
rockBtn.textContent = "✊ Rock";
paperBtn.textContent = "✋ Paper";
scissorsBtn.textContent = "✌️ Scissors";

// Utility: random choice for computer
function getComputerChoice() {
  const options = Object.keys(beats);
  return options[Math.floor(Math.random() * options.length)];
}

// Update the status headline (score)
function updateStatus() {
  statusHead.textContent = `You: ${playerScore}   CPU: ${computerScore}`;
}

// Show the chosen moves
function showMoves(player, computer) {
  playerMoveEl.textContent = `You: ${formatMove(player)}`;
  computerMoveEl.textContent = `CPU: ${formatMove(computer)}`;
}

// Helper to get emoji + name
function formatMove(move) {
  switch (move) {
    case "rock":
      return "✊ Rock";
    case "paper":
      return "✋ Paper";
    case "scissors":
      return "✌️ Scissors";
    default:
      return move;
  }
}

// Decide round outcome
function playRound(playerChoice) {
  if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
    // Game already ended; ignore until reset
    return;
  }

  const computerChoice = getComputerChoice();

  showMoves(playerChoice, computerChoice);

  if (playerChoice === computerChoice) {
    statusHead.textContent = "Tie! " + statusHead.textContent;
    flash(statusHead, "#f0e68c");
    return;
  }

  if (beats[playerChoice] === computerChoice) {
    playerScore += 1;
    statusHead.textContent = "You win the round! " + statusHead.textContent;
    flash(playerMoveEl, "#b2ffb2");
  } else {
    computerScore += 1;
    statusHead.textContent = "CPU wins the round! " + statusHead.textContent;
    flash(computerMoveEl, "#ffb2b2");
  }

  updateStatus();

  // Check terminal condition
  if (playerScore === WINNING_SCORE || computerScore === WINNING_SCORE) {
    const winner =
      playerScore > computerScore ? "🎉 You won the game!" : "💀 CPU won the game!";
    statusHead.textContent = winner + ` Final score — You: ${playerScore} CPU: ${computerScore}`;
    // Offer reset after short delay
    setTimeout(resetGame, 2500);
  }
}

// Simple flash effect
function flash(el, color) {
  const orig = el.style.backgroundColor;
  el.style.transition = "background-color 0.3s ease";
  el.style.backgroundColor = color;
  setTimeout(() => {
    el.style.backgroundColor = orig;
  }, 400);
}

// Reset everything
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  updateStatus();
  playerMoveEl.textContent = "";
  computerMoveEl.textContent = "";
  statusHead.textContent = "Make your move!";
}

// Attach listeners
rockBtn.addEventListener("click", () => playRound("rock"));
paperBtn.addEventListener("click", () => playRound("paper"));
scissorsBtn.addEventListener("click", () => playRound("scissors"));

// Initial setup
resetGame();
