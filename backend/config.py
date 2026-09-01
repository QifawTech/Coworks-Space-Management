# import os

# class Config:
#     SECRET_KEY = os.environ.get('SECRET_KEY') or 'super_secret_co_workspace_key_2026'
#     MYSQL_HOST = 'localhost'
#     MYSQL_USER = 'root'
#     MYSQL_PASSWORD = ''  # XAMPP-ல் பாஸ்வேர்ட் எதுவும் இல்லை என்றால் காலியாக விடவும்
#     MYSQL_DB = 'co_workspace_db'
import os
from dotenv import load_dotenv

# .env ஃபைலில் உள்ள தகவல்களை லோட் செய்தல்
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    MYSQL_HOST = os.getenv('DB_HOST', 'localhost')
    MYSQL_USER = os.getenv('DB_USER', 'root')
    MYSQL_PASSWORD = os.getenv('DB_PASSWORD', '')
    MYSQL_DB = os.getenv('DB_NAME', 'co_workspace_db')