# db.py
import pymysql
import base64
import os
from werkzeug.security import generate_password_hash

# These come from EB Environment Properties — no .env needed!
DB_HOST = os.environ.get('DB_HOST')
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_NAME = os.environ.get('DB_NAME')
DB_PORT = int(os.environ.get('DB_PORT', 3306))

def get_db_connection():
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT,
        cursorclass=pymysql.cursors.DictCursor
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
