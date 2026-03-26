from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS (allow frontend requests)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:8080", "http://127.0.0.1:5173"]}})

# Import routes
from api.routes import api_bp

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Backend is running!'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
