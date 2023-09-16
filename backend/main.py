from flask import Flask
from flask_socketio import SocketIO

from api import results, topics

app = Flask(__name__)
app.register_blueprint(results.app)
app.register_blueprint(topics.app)
socketio = SocketIO(app, cors_allowed_origins="*")

if __name__ == "__main__":
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
