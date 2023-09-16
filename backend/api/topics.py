from flask import Blueprint, jsonify

from db import db

app = Blueprint("topics", __name__)


@app.route("/topics", methods=["GET"])
def get_topics():
    # topics_data = [
    #     {'id': 1, 'theme': '水', 'topic1': '海', 'topic2': '川'},
    #     {'id': 2, 'theme': '飲み物', 'topic1': 'コーヒー', 'topic2': '紅茶'},
    # ]
    topics_data = db.get_topics()
    return jsonify(topics_data)
