from flask import Blueprint, jsonify, request

from models import result
from db import db, models

app = Blueprint("results", __name__)


@app.route("/results", methods=["GET"])
def get_results():
    # topics_data = [
    #     {
    #         "id": 1,
    #         "game_id": 1,
    #         "senryu": "あああああ\nあああああああ\nあああああ",
    #         "topic": "海",
    #         "is_wolf": False,
    #     },
    #     {
    #         "id": 2,
    #         "game_id": 1,
    #         "senryu": "いいいいい\nいいいいいいい\nいいいいい",
    #         "topic": "川",
    #         "is_wolf": True,
    #     },
    # ]
    topics_data = db.get_results()
    return jsonify(topics_data)


@app.route("/result", methods=["POST"])
def save_result():
    form = result.ResultForm(request.form)
    if not form.validate():
        print(f"Error: invalid form {form.data}")
        return jsonify({"status": "error", "errors": form.errors})

    data = form.data
    print(data)
    data_object = models.result(
        game_id=data["game_id"],
        senryu=data["senryu"],
        topic=data["topic"],
        is_wolf=data["is_wolf"],
    )
    db.add_result(data_object)

    return jsonify({"status": "success"})
