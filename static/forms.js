function initializeForms() {
    // Handle detailed game form
    const detailedForm = document.getElementById('detailed-game-form');
    if (detailedForm) {
        // Remove any existing event listeners to prevent duplicates
        detailedForm.replaceWith(detailedForm.cloneNode(true));
        const newDetailedForm = document.getElementById('detailed-game-form');
        
        newDetailedForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const numPlayers = parseInt(document.getElementById('num-players-detailed').value);
            if (!numPlayers || numPlayers < 2 || numPlayers > 8) {
                alert('Please enter a valid number of players (2-8)');
                return;
            }
            
            const gameData = {
                numPlayers: numPlayers,
                players: []
            };
            
            // Validate all decks first
            let allDecksValid = true;
            for (let i = 1; i <= numPlayers; i++) {
                if (!validateDeck(`deck-list-${i}`, i)) {
                    allDecksValid = false;
                }
            }
            
            if (!allDecksValid) {
                alert('Please fix the deck validation errors before submitting.');
                return;
            }
            
            // Collect all player data
            for (let i = 1; i <= numPlayers; i++) {
                const playerName = document.getElementById(`player-name-${i}`).value;
                const deckList = document.getElementById(`deck-list-${i}`).value;
                const deckData = parseDeckListText(deckList);
                
                gameData.players.push({
                    id: i,
                    name: playerName,
                    deckList: deckList,
                    deckStats: deckData
                });
            }
            
            console.log('Game Data:', gameData);
            alert(`Game data collected successfully for ${numPlayers} players!`);
        });
    }
    
    // Handle cube upload form
    const cubeForm = document.getElementById('cube-upload-form');
    if (cubeForm) {
        cubeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const deckList = document.getElementById('deck-list').value;
            if (!deckList.trim()) {
                alert('Please enter a cube list');
                return;
            }
            
            const cubeData = parseDeckListText(deckList);
            
            console.log('Cube Data:', cubeData);
            alert(`Cube uploaded successfully! ${cubeData.length} cards processed.`);
        });
    }
}

function validateDeck(textareaId, playerNumber) {
    const textarea = document.getElementById(textareaId);
    const deckText = textarea.value.trim();
    
    if (!deckText) {
        textarea.style.borderColor = '#e74c3c';
        return false;
    }
    
    const cards = parseDeckListText(deckText);
    
    if (cards.length === 0) {
        textarea.style.borderColor = '#e74c3c';
        alert(`Player ${playerNumber}: Please enter at least one card in the deck list.`);
        return false;
    }
    
    textarea.style.borderColor = '#27ae60'; // Green for valid
    return true;
}


function resetDetailedGameForm() {
    document.getElementById('detailed-game-form').reset();
    document.getElementById('detailed-players-container').innerHTML = '';
    document.getElementById('detailed-submit-section').style.display = 'none';
}
