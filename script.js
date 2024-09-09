// Game state
const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let aiEnabled = false;
const statusDisplay = document.querySelector('#status');

// Winning conditions
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Display current player's turn
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

// Display game result
const winningMessage = () => `Player ${currentPlayer} wins!`;
const tieMessage = () => `It's a tie!`;

// Set initial status
statusDisplay.innerHTML = currentPlayerTurn();

// Handle player actions
function handleCellPlayed(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = tieMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();

    if (aiEnabled && currentPlayer === 'O' && gameActive) {
        setTimeout(() => aiMove(), 500);
    }
}

// AI makes a random move
function aiMove() {
    const emptyCells = board.map((val, idx) => (val === '' ? idx : null)).filter(idx => idx !== null);
    const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const clickedCell = document.querySelector(`.cell[data-index="${randomCellIndex}"]`);

    handleCellPlayed(clickedCell, randomCellIndex);
    handleResultValidation();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive || (aiEnabled && currentPlayer === 'O')) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleResetGame() {
    gameActive = true;
    currentPlayer = 'X';
    board.fill('');
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => (cell.innerHTML = ''));
}

function enableAiMode() {
    aiEnabled = true;
    handleResetGame();
    statusDisplay.innerHTML = "Single Player Mode (AI) Enabled!";
}

function enablePlayerMode() {
    aiEnabled = false;
    handleResetGame();
    statusDisplay.innerHTML = "Two Player Mode Enabled!";
}

// Event listeners for cell clicks, reset button, and mode selection
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('#reset-button').addEventListener('click', handleResetGame);
document.querySelector('#ai-mode').addEventListener('click', enableAiMode);
document.querySelector('#player-mode').addEventListener('click', enablePlayerMode);
