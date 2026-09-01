from flask import Flask, send_from_directory
from flask_cors import CORS
import os


# db.py-ல் இருந்து கனெக்ஷனை இறக்குமதி செய்தல்
from db import get_db_connection, encrypt_data, decrypt_data

# ரவுட்ஸ்களை இறக்குமதி செய்தல்
from routes.auth_routes import auth_bp
from routes.super_admin_routes import super_admin_bp
from routes.admin_routes import admin_bp
from routes.tenant_routes import tenant_bp

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ப்ளூபிரிண்ட்களை ரிஜிஸ்டர் செய்தல்
app.register_blueprint(auth_bp)
app.register_blueprint(super_admin_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(tenant_bp)

@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    uploads_dir = os.path.join(app.root_path, 'uploads')
    return send_from_directory(uploads_dir, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)