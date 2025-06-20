# app.py - Flask Backend Server
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'cubandb',
    'user': 'wheil10',
    'password': 'Cruc1f0rmK3y/'
}

# Database connection function
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Database Error: {e}")
        return None

# API Routes
@app.route('/')
def home():
    # Serve the HTML file from the current directory
    return render_template('gadunka.html')


# Get all card stats
@app.route('/api/cardstats', methods=['GET'])
def get_cardstats():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM card ORDER BY card_name ASC")
        cards = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(cards)
    except Error as e:
        return jsonify({'error': str(e)}), 500

# Get all players
@app.route('/api/players', methods=['GET'])
def get_players():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM player ORDER BY username ASC")
        players = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(players)
    except Error as e:
        return jsonify({'error': str(e)}), 500

# # Add a new game
# @app.route('/api/game', methods=['POST'])
# def add_game():
#     data = request.get_json()

#     #OptionaL: add check for required fields, form already does this though
    
#     connection = get_db_connection()
#     if not connection:
#         return jsonify({'error': 'Database connection failed'}), 500

#     try:
#         cursor = connection.cursor()
#         query = ""
#         for item in data:


#     except Error as e:
#         return jsonify({'error': str(e)}), 500

# Add a new card
@app.route('/api/cardstats', methods=['POST'])
def add_card():
    data = request.get_json()
    
    # Check for required fields
    required_fields = ['card_name', 'tags', 'color_cat']
    if not data or not all(key in data for key in required_fields):
        return jsonify({'error': 'Missing required fields: card_name, tags, color_cat'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO card (card_name, colors, cmc, card_type, tags, color_cat)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            data['card_name'],
            data.get('colors', ''),
            data.get('cmc', 0),
            data.get('card_type', ''),
            data['tags'],
            data['color_cat']
        )
        cursor.execute(query, values)
        connection.commit()
        
        card_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Card added successfully', 'id': card_id}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 500

# Add a new player
@app.route('/api/players', methods=['POST'])
def add_player():
    data = request.get_json()
    
    if not data or 'username' not in data:
        return jsonify({'error': 'Missing required field: username'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO player (username, wins, favorite_color, most_used_combo)
            VALUES (%s, %s, %s, %s)
        """
        values = (
            data['username'],
            data.get('wins', 0),
            data.get('favorite_color', ''),
            data.get('most_used_combo', '')
        )
        cursor.execute(query, values)
        connection.commit()
        
        player_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Player added successfully', 'id': player_id}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 500


# Replace the add_deck function in app.py with this corrected version:
@app.route('/api/decks', methods=['POST'])
def add_deck():
    data = request.get_json()
    
    required_fields = ['player_name', 'cards']
    if not data or not all(key in data for key in required_fields):
        return jsonify({'error': 'Missing required fields: player_name, cards'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        
        # Convert username to player_id - FIX: Use correct variable name
        player_query = "SELECT player_id FROM player WHERE username = %s"
        cursor.execute(player_query, (data['player_name'],))
        player_result = cursor.fetchone()
        
        if not player_result:
            return jsonify({'error': f'Player {data["player_name"]} not found'}), 404
        
        player_id = player_result[0]
        
        # Insert deck
        deck_query = "INSERT INTO deck (player_player_id) VALUES (%s)"
        cursor.execute(deck_query, (player_id,))
        deck_id = cursor.lastrowid
        
        # Insert cards for this deck
        card_query = "INSERT INTO card_in_deck (deck_id, card_name, quantity) VALUES (%s, %s, %s)"
        
        for card in data['cards']:
            card_values = (deck_id, card['name'], card.get('quantity', 1))
            cursor.execute(card_query, card_values)
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Deck uploaded successfully', 'deck_id': deck_id}), 201
        
    except Error as e:
        return jsonify({'error': str(e)}), 500

# # Get all decks
# @app.route('/api/decks', methods=['GET'])
# def get_decks():
#     connection = get_db_connection()
#     if not connection:
#         return jsonify({'error': 'Database connection failed'}), 500
    
#     try:
#         cursor = connection.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM deck ORDER BY deck_name ASC")
#         decks = cursor.fetchall()
#         cursor.close()
#         connection.close()
#         return jsonify(decks)
#     except Error as e:
#         return jsonify({'error': str(e)}), 500





# Search functionality
@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'No search query provided'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Search in cards
        search_query = f"%{query}%"
        
        cursor.execute("""
            SELECT 'card' as type, card_name, color_cat, tags 
            FROM card
            WHERE card_name LIKE %s OR tags LIKE %s OR color_cat LIKE %s
        """, (search_query, search_query, search_query))
        
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        
        return jsonify(results)
    except Error as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Available endpoints:")
    print("- GET /api/cardstats - Get all cards")
    print("- POST /api/cardstats - Add new card")
    print("- GET /api/players - Get all players")
    print("- POST /api/players - Add new player")
    print("- GET /api/search?q=query - Search content")
    print("Attempting database connection...")
    
    # Test database connection
    conn = get_db_connection()
    if conn:
        print("Database connection successful!")
        conn.close()
    else:
        print("Database connection failed!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)