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
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Database Connected Website</title>
        <script>
            // This would be your frontend JavaScript
            async function loadServices() {
                try {
                    const response = await fetch('/api/services');
                    const services = await response.json();
                    console.log('Services:', services);
                    // Update your HTML with this data
                } catch (error) {
                    console.error('Error loading services:', error);
                }
            }
        </script>
    </head>
    <body>
        <h1>Your Website</h1>
        <p>This backend is serving your frontend and database!</p>
    </body>
    </html>
    """)

# Get all services
@app.route('/api/services', methods=['GET'])
def get_services():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM services ORDER BY created_at DESC")
        services = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(services)
    except Error as e:
        return jsonify({'error': str(e)}), 500

# Get all players
@app.route('/api/players', methods=['GET'])
def get_projects():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM player ORDER BY created_at DESC")
        projects = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(projects)
    except Error as e:
        return jsonify({'error': str(e)}), 500

# Add a new service
@app.route('/api/services', methods=['POST'])
def add_service():
    data = request.get_json()
    
    if not data or not all(key in data for key in ['title', 'description', 'price']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO services (title, description, price, image_url)
            VALUES (%s, %s, %s, %s)
        """
        values = (
            data['title'],
            data['description'],
            data['price'],
            data.get('image_url', '')
        )
        cursor.execute(query, values)
        connection.commit()
        
        service_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Service added successfully', 'id': service_id}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 500

# Submit contact form
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    
    required_fields = ['name', 'email', 'message']
    if not data or not all(key in data for key in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO contact_messages (name, email, service, message)
            VALUES (%s, %s, %s, %s)
        """
        values = (
            data['name'],
            data['email'],
            data.get('service', ''),
            data['message']
        )
        cursor.execute(query, values)
        connection.commit()
        
        message_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Contact form submitted successfully', 'id': message_id}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 500

# Get contact messages (admin only)
@app.route('/api/messages', methods=['GET'])
def get_messages():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM contact_messages ORDER BY created_at DESC")
        messages = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(messages)
    except Error as e:
        return jsonify({'error': str(e)}), 500

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
            SELECT 'service' as type, id, title as name, description 
            FROM services 
            WHERE title LIKE %s OR description LIKE %s
            UNION
            SELECT 'project' as type, id, name, description 
            FROM projects 
            WHERE name LIKE %s OR description LIKE %s OR technology LIKE %s
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