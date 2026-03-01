"""
Habit Tracker Backend - Flask Server
Serves and persists habit data as JSON
"""

from flask import Flask, request, jsonify, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='../frontend', static_url_path='')

# Data file path
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
DATA_FILE = os.path.join(DATA_DIR, 'habits.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize empty habits file if it doesn't exist
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)


@app.route('/')
def index():
    """Serve the frontend"""
    return send_from_directory('../frontend', 'index.html')


@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})


@app.route('/data', methods=['GET'])
def get_data():
    """Return habits data from JSON file"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
            return jsonify(data)
        return jsonify([])
    except Exception as e:
        print(f"Error reading data: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/save', methods=['POST'])
def save_data():
    """Save habits data to JSON file"""
    try:
        data = request.get_json()
        
        if data is None:
            return jsonify({'error': 'No data provided'}), 400
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        return jsonify({'success': True, 'message': 'Data saved successfully'})
    except Exception as e:
        print(f"Error saving data: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("🚀 Starting Habit Tracker Backend...")
    print(f"📁 Data file: {DATA_FILE}")
    print("🌐 Server running at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)

