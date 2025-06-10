

// Global variables
        let playersData = [];
        let cardsData = [];



// Utility function for debugging
function debugState() {
    console.log('Current page:', document.querySelector('.page.active')?.id);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Available pages:', Array.from(document.querySelectorAll('.page')).map(p => p.id));
}

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



//Event Listeners
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

