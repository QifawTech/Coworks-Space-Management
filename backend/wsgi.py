# wsgi.py
import os
from app import create_app

# Load environment
env = os.environ.get('FLASK_ENV', 'production')

# Create the application instance
application = create_app(env)

if __name__ == "__main__":
    application.run(host='0.0.0.0', port=5000)
