# wsgi.py  ← NEW FILE, add to root of project
from app import app as application  # import your existing Flask app

if __name__ == "__main__":
    application.run()
