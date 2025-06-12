// Tournament bracket generation
        function generateBracket(numPlayers) {
            // Find the next power of 2 that accommodates all players
            const bracketSize = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
            const numByes = bracketSize - numPlayers;
            
            const bracket = {
                size: bracketSize,
                players: numPlayers,
                byes: numByes,
                rounds: Math.log2(bracketSize)
            };
            
            return bracket;
        }


function updateBracketWithNames() {
            const numPlayers = parseInt(document.getElementById('num-players-detailed').value);
            if (!numPlayers || numPlayers < 2) return;
            
            const playerNames = [];
            for (let i = 1; i <= numPlayers; i++) {
                const nameInput = document.getElementById(`player-name-${i}`);
                playerNames.push(nameInput.value || `Player ${i}`);
            }
            
            const bracket = generateBracket(numPlayers);
            displayBracket(bracket, playerNames);
        }

async function generateDetailedPlayerFields() {
    const numPlayers = parseInt(document.getElementById('num-players-detailed').value);
    const container = document.getElementById('detailed-players-container');
    const submitSection = document.getElementById('detailed-submit-section');
    
    // Clear existing fields
    container.innerHTML = '';
    
    if (numPlayers && numPlayers >= 2 && numPlayers <= 8) {
        // Generate and display bracket
        const bracket = generateBracket(numPlayers);
        displayBracket(bracket);
        
        // Generate player input fields
        for (let i = 1; i <= numPlayers; i++) {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'form-group';
            playerDiv.style.cssText = 'border: 1px solid #ddd; padding: 20px; margin: 15px 0; border-radius: 10px;';
            
            playerDiv.innerHTML = `
                <h3>Player ${i}</h3>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px;">
                    <div>
                        <label for="player-name-${i}">Player Name</label>
                        <input type="text" id="player-name-${i}" name="player_name_${i}" required 
                               onchange="updateBracketWithNames()">
                    </div>
                    <div>
                        <label for="deck-list-${i}">Deck List</label>
                        <textarea id="deck-list-${i}" name="deck_list_${i}" rows="8" required 
                            placeholder="Enter one card per line, format: 'Quantity Card Name' or just 'Card Name'

Example:
4 Lightning Bolt
2 Counterspell
1 Serra Angel
Ancestral Recall"
                            onblur="validateDeck('deck-list-${i}', ${i})">
                        </textarea>
                    </div>
                </div>
            `;
            const matchDiv = document.createElement('div');
            matchDiv.className = 'form-group';
            matchDiv.style.cssText = 'border: 1px solid #ddd; padding: 20px; margin: 15px 0; border-radius: 10px;';
            matchDiv.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px;">
                <h3>Match 1 result</h3>
                    <label for="match-result-${i}">(Enter as "Score 1"-"Score 2", Ex: If player 1 won twice, then use "2-0") </label>
                    <input type="text id="match-result-${i}" name="match-result-${i}">
                </div>
            `;
            container.appendChild(playerDiv);
            if(i%2 == 0){
                container.appendChild(matchDiv);
            }
        }
        
        submitSection.style.display = 'block';
    } else {
        // Hide bracket and submit section if invalid number
        document.getElementById('bracket-display').style.display = 'none';
        submitSection.style.display = 'none';
    }
}

function parseDeckListText(deckListText) {
    const lines = deckListText.split('\n');
    const cards = [];
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        const match = line.match(/^(\d+)\s+(.+)$/);
        
        if (match) {
            cards.push({
                name: match[2].trim(),
                quantity: parseInt(match[1])
            });
        } else {
            cards.push({
                name: line.trim(),
                quantity: 1
            });
        }
    }
    
    return cards;
}
  