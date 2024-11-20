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