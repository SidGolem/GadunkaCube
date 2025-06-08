// frontend-database.js - Fixed version

// Configuration - Updated to match Flask backend
const API_BASE_URL = '/api'; // Changed from 'http://localhost:5000/api' to work with Flask's serve setup

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
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Page-specific data loading
function loadPageData(pageId) {
    switch(pageId) {
        case 'Players':
            loadPlayers();
            break;
        case 'Stats':
            loadCardStats();
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

// Load all players from database - Fixed to match backend structure
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

// Enhanced form submission handler for data entry
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await addCard(data);
        event.target.reset(); // Clear form on success
    } catch (error) {
        console.error('Form submission error:', error);
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

// Navigation button event listeners - Fixed to work with existing HTML
function initializeNavigation() {
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            showPageWithData(pageId);
        });
    });
}

// Initialize form handling
function initializeForms() {
    const dataEntryForm = document.getElementById('data-entry-form');
    if (dataEntryForm) {
        dataEntryForm.addEventListener('submit', handleFormSubmit);
    }
}

// Auto-load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Frontend database script loaded, initializing...');
    
    // Initialize all components
    initializeNavigation();
    initializeForms();
    initializeSearch();
    
    // Load initial data for home page display
    console.log('Loading initial data...');
    
    // Test database connection
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