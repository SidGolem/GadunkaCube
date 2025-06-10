// frontend-database.js

const API_BASE_URL = '/api'; 

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







        
        
        








