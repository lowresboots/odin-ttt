const Gameboard = (() => {
    let board = Array(9).fill(null);
    
    const getBoard = () => board;
    
    const makeMove = (index, player) => {
        if (board[index] === null) {
            board[index] = player;
            return true;
        }
        return false;
    };
    
    const reset = () => {
        board = Array(9).fill(null);
    };
    
    const isFull = () => {
        return board.every(cell => cell !== null);
    };
    
    return { getBoard, makeMove, reset, isFull };
})();

const Player = (name, marker, isBoot) => {
    return { name, marker, isBoot };
};

const GameController = (() => {
    let player;
    let computer;
    let currentPlayer;
    let gameActive = false;
    
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const findWinningMove = (board, marker) => {
        for (let i = 0; i < winCombos.length; i++) {
            const [a, b, c] = winCombos[i];
            if (board[a] === marker && board[b] === marker && board[c] === null) return c;
            if (board[a] === marker && board[c] === marker && board[b] === null) return b;
            if (board[b] === marker && board[c] === marker && board[a] === null) return a;
        }
        return null;
    };

    const computerMove = () => {
        const board = Gameboard.getBoard();
        
        const winningMove = findWinningMove(board, computer.marker);
        if (winningMove !== null) {
            Gameboard.makeMove(winningMove, computer.marker);
            return winningMove;
        }
        
        const blockingMove = findWinningMove(board, player.marker);
        if (blockingMove !== null) {
            Gameboard.makeMove(blockingMove, computer.marker);
            return blockingMove;
        }
        
        if (board[4] === null) {
            Gameboard.makeMove(4, computer.marker);
            return 4;
        }
        
        const availableMoves = board
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);
            
        if (availableMoves.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableMoves.length);
            const moveIndex = availableMoves[randomIndex];
            Gameboard.makeMove(moveIndex, computer.marker);
            return moveIndex;
        }
        
        return null;
    };
    
    const initialize = (playerName) => {
        const trimmedName = playerName.trim();
        const isSandalsPlayer = trimmedName.toLowerCase() === 'sandals';
        
        if (isSandalsPlayer) {
            player = Player('Sandals', 'sandal', true);
            computer = Player('Boots', 'boot', false);
        } else {
            player = Player(trimmedName || 'Boots', 'boot', true);
            computer = Player('Sandals', 'sandal', false);
        }

        currentPlayer = Math.random() < 0.5 ? player : computer;
        gameActive = true;
        Gameboard.reset();

        if (currentPlayer === computer) {
            computerMove();
            currentPlayer = player;
        }
    };
    
    const checkWinner = () => {
        return winCombos.some(combo => {
            const [a, b, c] = combo;
            const board = Gameboard.getBoard();
            return board[a] && 
                   board[a] === board[b] && 
                   board[a] === board[c];
        });
    };

    const handlePlayerMove = (index) => {
        if (!gameActive || currentPlayer !== player) return false;
        
        if (Gameboard.makeMove(index, player.marker)) {
            if (checkWinner()) {
                gameActive = false;
                return { status: 'win', player: player };
            }
            
            if (Gameboard.isFull()) {
                gameActive = false;
                return { status: 'tie' };
            }
            
            currentPlayer = computer;
            const computerMoveIndex = computerMove();
            
            if (checkWinner()) {
                gameActive = false;
                return { status: 'win', player: computer, computerMove: computerMoveIndex };
            }
            
            if (Gameboard.isFull()) {
                gameActive = false;
                return { status: 'tie', computerMove: computerMoveIndex };
            }
            
            currentPlayer = player;
            return { status: 'continue', computerMove: computerMoveIndex };
        }
        return false;
    };
    
    return {
        initialize,
        handlePlayerMove,
        isGameActive: () => gameActive,
        getCurrentPlayers: () => ({ player, computer })
    };
})();

const DisplayController = (() => {
    const bootImage = './images/boot.png';
    const sandalImage = './images/sandal.png';
    
    const renderCell = (cell, marker) => {
        const img = document.createElement('img');
        img.src = marker === 'boot' ? bootImage : sandalImage;
        img.alt = marker === 'boot' ? 'Boot' : 'Sandal';
        cell.innerHTML = '';
        cell.appendChild(img);
        cell.classList.add('marked');
        
        void cell.offsetWidth;
        img.style.opacity = '1';
    };
    
    const showGameOver = (message) => {
        const gameOver = document.querySelector('.game-over');
        const gameOverText = document.querySelector('.game-over-text');
        
        if (message.includes('wins')) {
            const name = message.split(' ')[0];
            const colorClass = (name === 'Sandals') ? 'winner-text-sandals' : 'winner-text-boots';
            gameOverText.innerHTML = `<span class="${colorClass}">${name}</span> wins!`;
        } else {
            gameOverText.textContent = message;
        }
        
        gameOver.classList.add('visible');
    };
    
    const hideGameOver = () => {
        const gameOver = document.querySelector('.game-over');
        gameOver.classList.remove('visible');
    };
    
    return { renderCell, showGameOver, hideGameOver };
})();

document.addEventListener('DOMContentLoaded', () => {
    const nameScreen = document.querySelector('.name-entry-screen');
    const nameInput = document.getElementById('nameInput');
    const proceedButton = document.querySelector('.proceed-button');
    const introScreen = document.querySelector('.intro-screen');
    const playButton = document.querySelector('.play-button');
    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.querySelector('.restart-button');
    
    function proceedToGame() {
        let playerName = nameInput.value.trim();
        if (!playerName) playerName = 'Boots';
        
        nameScreen.style.opacity = '0';
        nameScreen.style.pointerEvents = 'none';
        
        setTimeout(() => {
            nameScreen.style.display = 'none';
            introScreen.classList.add('active');
        }, 500);
    }
    
    function startGame() {
        introScreen.style.opacity = '0';
        introScreen.style.pointerEvents = 'none';
        
        board.style.display = 'block';
        
        void board.offsetWidth;
        
        board.classList.add('active');
        
        setTimeout(() => {
            introScreen.style.display = 'none';
        }, 500);
    
        GameController.initialize(nameInput.value.trim());
    
        const gameBoard = Gameboard.getBoard();
        const computerFirstMove = gameBoard.findIndex(cell => cell !== null);
        if (computerFirstMove !== -1) {
            setTimeout(() => {
                const computerCell = document.querySelector(`[data-index="${computerFirstMove}"]`);
                const { computer } = GameController.getCurrentPlayers();
                DisplayController.renderCell(computerCell, computer.marker);
            }, 600);
        }
    }

    function handleCellClick(cell) {
        const index = parseInt(cell.dataset.index);
        const result = GameController.handlePlayerMove(index);
        
        if (result) {
            const { player, computer } = GameController.getCurrentPlayers();
            DisplayController.renderCell(cell, player.marker);
            
            if (result.status === 'win') {
                if (result.player === player) {
                    DisplayController.showGameOver(`${result.player.name} wins!`);
                } else {
                    const computerCell = document.querySelector(`[data-index="${result.computerMove}"]`);
                    DisplayController.renderCell(computerCell, computer.marker);
                    setTimeout(() => {
                        DisplayController.showGameOver(`${result.player.name} wins!`);
                    }, 300);
                }
            } else if (result.status === 'tie') {
                if (result.computerMove !== undefined) {
                    const computerCell = document.querySelector(`[data-index="${result.computerMove}"]`);
                    DisplayController.renderCell(computerCell, computer.marker);
                }
                setTimeout(() => {
                    DisplayController.showGameOver("It's a tie!");
                }, 300);
            } else if (result.status === 'continue' && result.computerMove !== null) {
                setTimeout(() => {
                    const computerCell = document.querySelector(`[data-index="${result.computerMove}"]`);
                    DisplayController.renderCell(computerCell, computer.marker);
                }, 200);
            }
        }
    }
    
    proceedButton.addEventListener('click', proceedToGame);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            proceedToGame();
        }
    });
    playButton.addEventListener('click', startGame);
    
    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });

    restartButton.addEventListener('click', () => {
        DisplayController.hideGameOver();
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('marked');
        });
        GameController.initialize(nameInput.value.trim());

        const gameBoard = Gameboard.getBoard();
        const computerFirstMove = gameBoard.findIndex(cell => cell !== null);
        if (computerFirstMove !== -1) {
            setTimeout(() => {
                const computerCell = document.querySelector(`[data-index="${computerFirstMove}"]`);
                DisplayController.renderCell(computerCell, gameBoard[computerFirstMove]);
            }, 600);
        }
    });
});