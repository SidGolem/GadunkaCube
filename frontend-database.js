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
            
            document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

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
            showPage(pageId); // Your existing function
            loadPageData(pageId);
        }

        // Navigation button event listeners
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', function() {
                const pageId = this.getAttribute('data-page');
                showPageWithData(pageId);
            });
        });

        // Form handling
        function handleFormSubmit(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData);
            
            alert(`Thank you ${data.name}! Your message has been sent. We'll get back to you soon!`);
            
            // In a real application, you would send this data to your server
            console.log('Form data:', data);
        }

        function resetForm() {
            document.querySelector('form').reset();
        }

        // Initialize page
        console.log('Multi-page website loaded successfully!');
        console.log('Use Alt+1-5 for keyboard navigation');

        // frontend-db.js

        // Configuration
        const API_BASE_URL = 'http://localhost:5000/api';

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

        // Load card stats from database and display them
        async function loadCardStats() {
            try {
                const cardstats = await apiCall('/cardstats');
                displayCardStats(cardstats);
            } catch (error) {
                console.error('Error loading stats:', error);
                displayError('Failed to load stats. Please try again later.');
            }
        }

        // 111111111111 Display all cards in the UI 1111111111111111111
        function displayCardStats(cardstats) {
            const cardstatsContainer = document.getElementById('cardstats-container');
            if (!cardstatsContainer) return;
            
            cardstatsContainer.innerHTML = '';
            
            cardstats.forEach(cardstat => {
                const cardstatCard = document.createElement('div');
                cardstatCard.className = 'card';
                cardstatCard.innerHTML = `
                    <h3>${cardstat.card_name}</h3>
                    <p>${cardstat.color_cat}</p>
                    <p class="color_cat">$${cardstat.tags}</p>
                    ${cardstat.image_url ? `<img src="${cardstat.image_url}" alt="${cardstat.card_name}" style="max-width: 100%; border-radius: 8px;">` : ''}
                    <div style="margin-top: 15px;">
                        <button class="action-btn" onclick="selectcardstat('${cardstat.card_name}')">Select cardstat</button>
                    </div>
                `;
                cardstatsContainer.appendChild(cardstatCard);
            });
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

        // Display players in the UI
        function displayPlayers(players) {
            const playersContainer = document.getElementById('players-container');
            if (!playersContainer) return;
            
            playersContainer.innerHTML = '';
            
            players.forEach(player => {
                const playerCard = document.createElement('div');
                playerCard.className = 'card';
                playerCard.innerHTML = `
                    <h3>${player.username}</h3>
                    <p>${player.tags}</p>
                    <p><strong>Technology:</strong> ${player.technology}</p>
                    ${player.image_url ? `<img src="${player.image_url}" alt="${player.name}" style="max-width: 100%; border-radius: 8px; margin: 10px 0;">` : ''}
                    ${player.player_url ? `<a href="${player.player_url}" target="_blank" class="action-btn" style="display: inline-block; text-decoration: none; margin-top: 10px;">View player</a>` : ''}
                `;
                playersContainer.appendChild(playerCard);
            });
        }

        // Submit contact form to database
        async function submitContactForm(formData) {
            try {
                const result = await apiCall('/contact', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                
                alert('Thank you for your message! We\'ll get back to you soon.');
                document.querySelector('#contact form').reset();
                return result;
            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('Failed to send message. Please try again later.');
                throw error;
            }
        }

        // Search functionality
        async function searchContent(query) {
            if (!query.trim()) return;
            
            try {
                const results = await apiCall(`/search?q=${encodeURIComponent(query)}`);
                displaySearchResults(results);
            } catch (error) {
                console.error('Error searching:', error);
                displayError('Search failed. Please try again.');
            }
        }

        // Display search results
        function displaySearchResults(results) {
            const searchContainer = document.getElementById('search-results');
            if (!searchContainer) return;
            
            searchContainer.innerHTML = '';
            
            if (results.length === 0) {
                searchContainer.innerHTML = '<p>No results found.</p>';
                return;
            }
            
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result';
                resultItem.innerHTML = `
                    <h4>${result.name} (${result.type})</h4>
                    <p>${result.tags}</p>
                `;
                searchContainer.appendChild(resultItem);
            });
        }

        // Add new stats (admin function)
        async function addStats(cardstatData) {
            try {
                const result = await apiCall('/stats', {
                    method: 'POST',
                    body: JSON.stringify(cardstatData)
                });
                
                alert('Stats added successfully!');
                loadCardStats(); // Refresh the cardstats list
                return result;
            } catch (error) {
                console.error('Error adding cardstat:', error);
                alert('Failed to add cardstat. Please try again.');
                throw error;
            }
        }

        // Initialize database (run once)
        async function initializeDatabase() {
            try {
                const result = await apiCall('/init-db', { method: 'POST' });
                alert('Database initialized successfully!');
                return result;
            } catch (error) {
                console.error('Error initializing database:', error);
                alert('Failed to initialize database.');
                throw error;
            }
        }

        // Error display function
        function displayError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                background: #ff6b6b;
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
            `;
            errorDiv.textContent = message;
            
            // Insert at the top of the current page
            const currentPage = document.querySelector('.page.active');
            if (currentPage) {
                currentPage.insertBefore(errorDiv, currentPage.firstChild);
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorDiv.remove();
                }, 5000);
            }
        }

        // Enhanced form submission handler
        function handleDatabaseFormSubmit(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData);
            
            // Submit to database instead of just showing alert
            submitContactForm(data);
        }

        // Select cardstat function (for cardstat cards)
        function selectcardstat(cardstatName) {
            // Pre-fill the contact form with selected cardstat
            showPage('contact');
            setTimeout(() => {
                const cardstatSelect = document.getElementById('cardstat');
                if (cardstatSelect) {
                    // Find matching option
                    for (let option of cardstatSelect.options) {
                        if (option.text.toLowerCase().includes(cardstatName.toLowerCase())) {
                            option.selected = true;
                            break;
                        }
                    }
                }
            }, 100);
        }

        // Auto-load data when page loads
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Page loaded, initializing database connections...');
            
            // Load initial data for the home page
            loadCardStats();
            loadPlayers();
            
            // Override form submission
            const contactForm = document.querySelector('#contact form');
            if (contactForm) {
                contactForm.addEventListener('submit', handleDatabaseFormSubmit);
            }
            
            // Add search functionality if search input exists
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    const query = e.target.value;
                    if (query.length > 2) { // Start searching after 3 characters
                        searchContent(query);
                    }
                });
            }
        });

        // Example usage functions for testing
        function testDatabaseConnection() {
            console.log('Testing database connection...');
            loadCardStats();
        }

        function addTestcardstat() {
            const testcardstat = {
                card_name: 'Test cardstat',
                tags: 'This is a test cardstat added via JavaScript',
                color_cat: 99.99,
                image_url: 'https://via.placeholder.com/300x200'
            };
            addcardstat(testcardstat);
        }

        function followLinkById(linkId) {
            const link = document.getElementById(linkId); // Get the link element by its ID
                if (link) {
                link.click(); // Simulate a click
            }
        }
