# app.py - Flask Backend Server
from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime

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
        print(f"Error: {e}")
        return None

# API Routes
@app.route('/')
def home():
    # Serve your HTML file (you can also use render_template with separate HTML file)
    return render_template_string('gadunka.html')

# Get all card stats
@app.route('/api/cardstats', methods=['GET'])
def get_cardstats():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM card ORDER BY card_name DESC")
        services = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(services)
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
        cursor.execute("SELECT * FROM player ORDER BY username DESC")
        projects = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(projects)
    except Error as e:
        return jsonify({'error': str(e)}), 500

# Add a new cardstat
@app.route('/api/cardstats', methods=['POST'])
def add_service():
    data = request.get_json()
    
    if not data or not all(key in data for key in ['card_name', 'tags', 'color_cat']):
        return jsonify({'error': 'Missing required fields'}), 400
    
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
            data['colors'],
            data['cmc'],
            data['card_type'],
            data['tags'],
            data['color_cat']
        )
        cursor.execute(query, values)
        connection.commit()
        
        service_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Card added successfully', 'id': service_id}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 500

# # Submit update form
# @app.route('/api/update', methods=['POST'])
# def submit_update():
#     data = request.get_json()
    
#     required_fields = ['name', 'email', 'message']
#     if not data or not all(key in data for key in required_fields):
#         return jsonify({'error': 'Missing required fields'}), 400
    
#     connection = get_db_connection()
#     if not connection:
#         return jsonify({'error': 'Database connection failed'}), 500
    
#     try:
#         cursor = connection.cursor()
#         query = """
#             INSERT INTO contact_messages (name, email, service, message)
#             VALUES (%s, %s, %s, %s)
#         """
#         values = (
#             data['name'],
#             data['email'],
#             data.get('service', ''),
#             data['message']
#         )
#         cursor.execute(query, values)
#         connection.commit()
        
#         message_id = cursor.lastrowid
#         cursor.close()
#         connection.close()
        
#         return jsonify({'message': 'Contact form submitted successfully', 'id': message_id}), 201
#     except Error as e:
#         return jsonify({'error': str(e)}), 500

# # Get contact messages (admin only)
# @app.route('/api/messages', methods=['GET'])
# def get_messages():
#     connection = get_db_connection()
#     if not connection:
#         return jsonify({'error': 'Database connection failed'}), 500
    
#     try:
#         cursor = connection.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM contact_messages ORDER BY created_at DESC")
#         messages = cursor.fetchall()
#         cursor.close()
#         connection.close()
#         return jsonify(messages)
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
        
        # Search in services and projects
        search_query = f"%{query}%"
        
        cursor.execute("""
            SELECT 'card' as card_name, color_cat, tags as card_name, tags 
            FROM card
            WHERE card_name LIKE %s OR tags LIKE %s
        """, (search_query, search_query, search_query, search_query, search_query))
        
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        
        return jsonify(results)
    except Error as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("Starting Flask server...")
    print("Available endpoints:")
    print("- GET /api/services - Get all services")
    print("- POST /api/services - Add new service")
    print("- GET /api/projects - Get all projects")
    print("- POST /api/contact - Submit contact form")
    print("- GET /api/messages - Get contact messages")
    print("- GET /api/search?q=query - Search content")
    print("attempting database connection")
    get_db_connection()
    app.run(debug=True, host='0.0.0.0', port=5000)