// frontend-database.js - Fixed version

// Configuration - Updated to match Flask backend
const API_BASE_URL = '/api'; // Changed from 'http://localhost:5000/api' to work with Flask's serve setup

// Global variables
        let playersData = [];
        let cardsData = [];

// Make functions globally accessible for HTML onclick handlers
window.showPage = showPage;
window.generateDetailedPlayerFields = generateDetailedPlayerFields;
window.updateBracketWithNames = updateBracketWithNames;
window.validateDeck = validateDeck;
window.resetDetailedGameForm = resetDetailedGameForm;
window.viewWinningDeck = function() {
    alert('Winning deck view functionality - to be implemented');
};

// Utility function to make API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Page navigation functionality
// 2. FIX: Update the showPage function to handle data loading properly
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Load data when switching to specific pages
    switch(pageName) {
        case 'Players':
            loadPlayers();
            break;
        case 'Stats':
            loadCardStats();
            break;
        default:
            break;
    }
}

function loadPageData(pageId) {
    switch(pageId) {
        case 'Players':
            loadPlayers();
            break;
        case 'Stats':
            loadCardStats(); // This is actually correct - keep as loadCardStats()
            break;
        default:
            // No specific data loading needed
            break;
    }
}

// Enhanced page navigation with data loading
function showPageWithData(pageId) {
    showPage(pageId);
    loadPageData(pageId);
}

// Load card stats from database and display them - Fixed to match backend API
async function loadCardStats() {
    try {
        const cards = await apiCall('/cardstats'); // Changed from '/cardstats' to match Flask route
        displayCardStats(cards);
    } catch (error) {
        console.error('Error loading card stats:', error);
        displayError('Failed to load card stats. Please try again later.');
    }
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

// Load all players from database
async function loadPlayers() {
    try {
        const players = await apiCall('/players');
        displayPlayers(players);
    } catch (error) {
        console.error('Error loading players:', error);
        displayError('Failed to load players. Please try again later.');
    }
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

// Search functionality - Fixed to work with backend search endpoint
async function searchContent(query) {
    if (!query.trim()) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }
    
    try {
        const results = await apiCall(`/search?q=${encodeURIComponent(query)}`);
        displaySearchResults(results);
    } catch (error) {
        console.error('Error searching:', error);
        displayError('Search failed. Please try again.');
    }
}

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

// Add new card - Fixed to match backend card creation endpoint
async function addCard(cardData) {
    try {
        const result = await apiCall('/cardstats', {
            method: 'POST',
            body: JSON.stringify(cardData)
        });
        
        alert('Card added successfully!');
        
        // Refresh the cards list if we're on the stats page
        if (document.getElementById('Stats').classList.contains('active')) {
            loadCardStats();
        }
        
        return result;
    } catch (error) {
        console.error('Error adding card:', error);
        alert('Failed to add card. Please try again.');
        throw error;
    }
}

// Add new player - Fixed to match backend player creation endpoint
async function addPlayer(playerData) {
    try {
        const result = await apiCall('/players', {
            method: 'POST',
            body: JSON.stringify(playerData)
        });
        
        alert('Player added successfully!');
        
        // Refresh the players list if we're on the players page
        if (document.getElementById('Players').classList.contains('active')) {
            loadPlayers();
        }
        
        return result;
    } catch (error) {
        console.error('Error adding player:', error);
        alert('Failed to add player. Please try again.');
        throw error;
    }
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

// Add deck upload functionality
async function uploadDeck(deckData) {
    try {
        const result = await apiCall('/decks', {
            method: 'POST',
            body: JSON.stringify(deckData)
        });
        
        alert(`Deck uploaded successfully! Deck ID: ${result.deck_id}`);
        return result;
    } catch (error) {
        console.error('Error uploading deck:', error);
        alert('Failed to upload deck. Please try again.');
        throw error;
    }
}


// Parse deck list text into card array
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

// Replace the generateDetailedPlayerFields function with this corrected version
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
            container.appendChild(playerDiv);
        }
        
        submitSection.style.display = 'block';
    } else {
        // Hide bracket and submit section if invalid number
        document.getElementById('bracket-display').style.display = 'none';
        submitSection.style.display = 'none';
    }
}

// Make sure this function is available globally for the onchange event
function updateBracketWithNames() {
    const numPlayers = parseInt(document.getElementById('num-players-detailed').value);
    if (!numPlayers || numPlayers < 2) return;
    
    const playerNames = [];
    for (let i = 1; i <= numPlayers; i++) {
        const nameInput = document.getElementById(`player-name-${i}`);
        if (nameInput) {
            playerNames.push(nameInput.value || `Player ${i}`);
        }
    }
    
    const bracket = generateBracket(numPlayers);
    displayBracket(bracket, playerNames);
}

function resetDetailedGameForm() {
    document.getElementById('detailed-game-form').reset();
    document.getElementById('detailed-players-container').innerHTML = '';
    document.getElementById('detailed-submit-section').style.display = 'none';
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                document.getElementById('search-results').innerHTML = '';
                return;
            }
            
            // Debounce search to avoid too many API calls
            searchTimeout = setTimeout(() => {
                searchContent(query);
            }, 300);
        });
    }
}

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
        

// Fix the navigation initialization - replace the existing initializeNavigation function
function initializeNavigation() {
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            showPage(pageId); // Use showPage instead of showPageWithData to avoid double loading
        });
    });
}

// Form submission handler
        document.getElementById('detailed-game-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const numPlayers = parseInt(document.getElementById('num-players-detailed').value);
            const gameData = {
                numPlayers: numPlayers,
                players: []
            };
            
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
            
            // Here you would typically send the data to a server
            console.log('Game Data:', gameData);
            alert(`Game data collected successfully!\n\nPlayers: ${numPlayers}\nBracket: ${Math.log2(generateBracket(numPlayers).size)} rounds\n\nCheck console for full data.`);
        });

// Fix the form initialization - replace the existing initializeForms function
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('Frontend database script loaded, initializing...');
    
    // Initialize navigation FIRST
    initializeNavigation();
    initializeSearch();
    
    setTimeout(() => {
        initializeForms();
    }, 100);
    
    // Set initial page state
    showPage('Home');
    
    testDatabaseConnection();
});

// Test function to verify database connectivity
function testDatabaseConnection() {
    console.log('Testing database connection...');
    
    // Test loading cards
    loadCardStats().then(() => {
        console.log('Card stats loaded successfully');
    }).catch(error => {
        console.error('Failed to load card stats:', error);
    });
    
    // Test loading players
    loadPlayers().then(() => {
        console.log('Players loaded successfully');
    }).catch(error => {
        console.error('Failed to load players:', error);
    });
}

// Utility function for debugging
function debugState() {
    console.log('Current page:', document.querySelector('.page.active')?.id);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Available pages:', Array.from(document.querySelectorAll('.page')).map(p => p.id));
}