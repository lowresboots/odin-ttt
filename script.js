document.addEventListener('DOMContentLoaded', () => {
    const nameScreen = document.querySelector('.name-entry-screen');
    const nameInput = document.getElementById('nameInput');
    const proceedButton = document.querySelector('.proceed-button');
    
    function proceedToGame() {
        let playerName = nameInput.value.trim();
        if (!playerName) playerName = 'Boots';
        
        nameScreen.style.opacity = '0';
        nameScreen.style.pointerEvents = 'none';
    }
    
    proceedButton.addEventListener('click', proceedToGame);
    
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            proceedToGame();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const nameScreen = document.querySelector('.name-entry-screen');
    const nameInput = document.getElementById('nameInput');
    const proceedButton = document.querySelector('.proceed-button');
    const introScreen = document.querySelector('.intro-screen');
    const playButton = document.querySelector('.play-button');
    const board = document.querySelector('.board');
    
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
    }
    
    proceedButton.addEventListener('click', proceedToGame);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            proceedToGame();
        }
    });
    playButton.addEventListener('click', startGame);
});