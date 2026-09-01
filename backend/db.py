

import mysql.connector
import base64
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

load_dotenv()

def get_db_connection():
    connection = mysql.connector.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'co_workspace_db')
    )
    return connection

def encrypt_data(data):
    if not data:
        return ""
    return base64.b64encode(data.encode('utf-8')).decode('utf-8')

def decrypt_data(data):
    if not data:
        return ""
    try:
        return base64.b64decode(data.encode('utf-8')).decode('utf-8')
    except:
        return data