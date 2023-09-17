from flask import Blueprint, jsonify

from db import db

app = Blueprint("results", __name__)


@app.route("/results", methods=["GET"])
def get_results():
    topics_data = db.get_results()
    return jsonify(topics_data)
