let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp";  // Default mode is Player vs Player

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const statusDisplay = document.getElementById("status");

function setGameMode() {
    gameMode = document.getElementById("mode").value;
    resetGame();
}

function makeMove(index) {
    if (gameActive && board[index] === "") {
        board[index] = currentPlayer;
        const cell = document.querySelectorAll(".cell")[index];
        cell.textContent = currentPlayer;
        cell.style.color = currentPlayer === "X" ? "#FF6B6B" : "#556270";
        checkResult();

        if (gameActive) {
            if (gameMode === "pvp") {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
            } else if (gameMode === "easy" && currentPlayer === "X") {
                currentPlayer = "O";
                setTimeout(makeEasyMove, 500);
            } else if (gameMode === "hard" && currentPlayer === "X") {
                currentPlayer = "O";
                setTimeout(makeHardMove, 500);
            }
        }
    }
}

function checkResult() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightWinningCells(combination);
            statusDisplay.textContent = `${board[a]} wins!`;
            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        statusDisplay.textContent = "It's a draw!";
    }
}

function highlightWinningCells(cells) {
    cells.forEach(index => {
        const cell = document.querySelectorAll(".cell")[index];
        cell.style.backgroundColor = "#4CAF50";
    });
}

function makeEasyMove() {
    let availableMoves = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (availableMoves.length > 0) {
        let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        board[randomMove] = "O";
        const cell = document.querySelectorAll(".cell")[randomMove];
        cell.textContent = "O";
        cell.style.color = "#556270";
        checkResult();

        if (gameActive) {
            currentPlayer = "X";
        }
    }
}

function makeHardMove() {
    // Check if AI can win
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === "O" && board[b] === "O" && board[c] === "") {
            return makeAIMove(c);
        }
        if (board[a] === "O" && board[c] === "O" && board[b] === "") {
            return makeAIMove(b);
        }
        if (board[b] === "O" && board[c] === "O" && board[a] === "") {
            return makeAIMove(a);
        }
    }

    // Block the player if they can win
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === "X" && board[b] === "X" && board[c] === "") {
            return makeAIMove(c);
        }
        if (board[a] === "X" && board[c] === "X" && board[b] === "") {
            return makeAIMove(b);
        }
        if (board[b] === "X" && board[c] === "X" && board[a] === "") {
            return makeAIMove(a);
        }
    }

    // If no immediate win or block, pick a random move
    makeEasyMove();
}

function makeAIMove(index) {
    board[index] = "O";
    const cell = document.querySelectorAll(".cell")[index];
    cell.textContent = "O";
    cell.style.color = "#556270";
    checkResult();

    if (gameActive) {
        currentPlayer = "X";
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        cell.style.color = "#ffffff";
    });
    statusDisplay.textContent = "";
}
