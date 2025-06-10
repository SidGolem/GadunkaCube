//Navigation.js

// Make functions globally accessible for HTML onclick handlers
window.showPage = showPage;
window.generateDetailedPlayerFields = generateDetailedPlayerFields;
window.updateBracketWithNames = updateBracketWithNames;
window.validateDeck = validateDeck;
window.resetDetailedGameForm = resetDetailedGameForm;
window.viewWinningDeck = function() {
    alert('Winning deck view functionality - to be implemented');
};


// Fix the navigation initialization - replace the existing initializeNavigation function
function initializeNavigation() {
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            showPage(pageId); // Use showPage instead of showPageWithData to avoid double loading
        });
    });
}


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
