from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from api import results, rooms

app = Flask(__name__)
app.register_blueprint(results.app)
app.register_blueprint(rooms.app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

if __name__ == "__main__":
    socketio.run(app, port='8888', host='0.0.0.0', debug=True, allow_unsafe_werkzeug=True)
