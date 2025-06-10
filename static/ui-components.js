
// Display search results - Fixed to match backend search response
function displaySearchResults(results) {
    const searchContainer = document.getElementById('search-results');
    if (!searchContainer) return;
    
    if (results.length === 0) {
        searchContainer.innerHTML = '<div class="search-result-item">No results found.</div>';
        return;
    }
    
    searchContainer.innerHTML = results.map(result => `
        <div class="search-result-item">
            <strong>${result.card_name}</strong><br>
            <small>Category: ${result.color_cat} | Tags: ${result.tags}</small>
        </div>
    `).join('');
}

// Display all cards in the UI - Fixed to match actual card data structure
function displayCardStats(cards) {
    const cardsContainer = document.getElementById('cards-container'); // Fixed ID to match HTML
    if (!cardsContainer) {
        console.error('Cards container not found');
        return;
    }
    
    if (cards.length === 0) {
        cardsContainer.innerHTML = '<div class="card"><h3>No cards found</h3><p>Add some cards to get started!</p></div>';
        return;
    }
    
    cardsContainer.innerHTML = cards.map(card => `
        <div class="card">
            <h3>${card.card_name}</h3>
            <p><strong>Colors:</strong> ${card.colors || 'None'}</p>
            <p><strong>CMC:</strong> ${card.cmc || 0}</p>
            <p><strong>Type:</strong> ${card.card_type || 'Unknown'}</p>
            <p><strong>Tags:</strong> ${card.tags || 'None'}</p>
            <p><strong>Category:</strong> ${card.color_cat || 'Unknown'}</p>
        </div>
    `).join('');
}



// Error display function
function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #e74c3c;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: center;
        position: relative;
        z-index: 1000;
    `;
    errorDiv.textContent = message;
    
    // Insert at the top of the current page
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        currentPage.insertBefore(errorDiv, currentPage.firstChild);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}





function displayBracket(bracket, playerNames = []) {
            const container = document.getElementById('bracket-display');
            
            if (bracket.players < 2) {
                container.style.display = 'none';
                return;
            }
            
            container.style.display = 'block';
            
            let html = `
                <div class="bracket-container">
                    <div class="bracket-title">Tournament Bracket (${bracket.players} Players)</div>
                    <div class="bracket">
            `;
            
            // Generate rounds
            let currentRoundSize = bracket.size / 2;
            for (let round = 1; round <= bracket.rounds; round++) {
                html += `
                    <div class="round">
                        <div class="round-title">${round === bracket.rounds ? 'Final' : round === bracket.rounds - 1 ? 'Semi-Final' : `Round ${round}`}</div>
                `;
                
                for (let match = 0; match < currentRoundSize; match++) {
                    if (round === 1) {
                        // First round - show actual matchups
                        const player1Index = match * 2;
                        const player2Index = match * 2 + 1;
                        
                        let player1 = player1Index < bracket.players ? (playerNames[player1Index] || `Player ${player1Index + 1}`) : 'BYE';
                        let player2 = player2Index < bracket.players ? (playerNames[player2Index] || `Player ${player2Index + 1}`) : 'BYE';
                        
                        const isBye = player1 === 'BYE' || player2 === 'BYE';
                        
                        html += `
                            <div class="match ${isBye ? 'bye' : ''}">
                                <div class="player-slot">${player1}</div>
                                <div style="margin: 5px 0; font-weight: bold;">vs</div>
                                <div class="player-slot">${player2}</div>
                            </div>
                        `;
                    } else {
                        // Later rounds - show TBD
                        html += `
                            <div class="match">
                                <div class="player-slot">TBD</div>
                                <div style="margin: 5px 0; font-weight: bold;">vs</div>
                                <div class="player-slot">TBD</div>
                            </div>
                        `;
                    }
                }
                
                html += '</div>';
                currentRoundSize /= 2;
            }
            
            html += '</div></div>';
            
            if (bracket.byes > 0) {
                html += `<p style="text-align: center; color: #6c757d; margin-top: 10px;">
                    <strong>Note:</strong> ${bracket.byes} player(s) will receive a bye in the first round.
                </p>`;
            }
            
            container.innerHTML = html;
        }


// Display players in the UI - Fixed to match actual player data structure
function displayPlayers(players) {
    const playersContainer = document.getElementById('players-container'); // Matches HTML ID
    if (!playersContainer) {
        console.error('Players container not found');
        return;
    }
    
    if (players.length === 0) {
        playersContainer.innerHTML = '<div class="card"><h3>No players found</h3><p>Add some players to get started!</p></div>';
        return;
    }
    
    playersContainer.innerHTML = players.map(player => `
        <div class="card">
            <h3>${player.username}</h3>
            <ul style="text-align: left; list-style: none; padding: 0;">
                <li><strong>Wins:</strong> ${player.wins || 0}</li>
                <li><strong>Favorite Color:</strong> ${player.favorite_color || 'Not set'}</li>
                <li><strong>Most Used Combo:</strong> ${player.most_used_combo || 'None recorded'}</li>
            </ul>
        </div>
    `).join('');
}
