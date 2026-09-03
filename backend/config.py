# import os

# class Config:
#     SECRET_KEY = os.environ.get('SECRET_KEY') or 'super_secret_co_workspace_key_2026'
#     MYSQL_HOST = flask-db.ctyq26mko53d.ap-south-1.rds.amazonaws.com
#     MYSQL_USER = admin
#     MYSQL_PASSWORD =  Qspaceco-work
#     MYSQL_DB = 'co_workspace_db'
import os
from dotenv import load_dotenv

# .env ஃபைலில் உள்ள தகவல்களை லோட் செய்தல்
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret_key')
    MYSQL_HOST = os.environ.get('DB_HOST')
    MYSQL_USER = os.environ.get('DB_USER')
    MYSQL_PASSWORD = os.environ.get('DB_PASSWORD')
    MYSQL_DB = os.environ.get('DB_NAME')
    MYSQL_PORT = int(os.environ.get('DB_PORT', 3306))
