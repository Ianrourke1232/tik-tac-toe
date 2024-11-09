const cells = document.querySelectorAll('[data-cell]');
const statusDisplay = document.getElementById('status');
let isXNext = true;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedIndex = Array.from(cells).indexOf(clickedCell);

    if (gameBoard[clickedIndex] !== '' || !isGameActive) {
        return;
    }

    gameBoard[clickedIndex] = isXNext ? 'X' : 'O';
    clickedCell.textContent = isXNext ? 'X' : 'O';

    if (checkWinner()) {
        setGameStatus(isXNext ? 'Player X wins!' : 'Player O wins!');
        isGameActive = false;
    } else if (gameBoard.every(cell => cell !== '')) {
        setGameStatus('It\'s a draw!');
        isGameActive = false;
    } else {
        isXNext = !isXNext;
        statusDisplay.textContent = `Player ${isXNext ? 'X' : 'O'}'s turn`;
        if (!isXNext) {
            setTimeout(aiMove, 500); // AI move for player O
        }
    }
}

function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}

function setGameStatus(status) {
    statusDisplay.textContent = status;
}

function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    isXNext = true;
    isGameActive = true;
    statusDisplay.textContent = `Player X's turn`;

    cells.forEach(cell => {
        cell.textContent = '';
    });
}

function aiMove() {
    if (!isGameActive) return;

    const emptyCells = gameBoard.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    gameBoard[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';

    if (checkWinner()) {
        setGameStatus('Player O wins!');
        isGameActive = false;
    } else if (gameBoard.every(cell => cell !== '')) {
        setGameStatus('It\'s a draw!');
        isGameActive = false;
    } else {
        isXNext = true;
        statusDisplay.textContent = `Player X's turn`;
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
