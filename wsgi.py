import os
import sys

# Ensure Python can find modules inside /backend
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from wsgi import application

if __name__ == "__main__":
    application.run()
