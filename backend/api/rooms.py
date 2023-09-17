import random

from flask import Blueprint, jsonify, request

from models import room_form
from db import db

app = Blueprint("rooms", __name__)


# メモリで保持するルーム情報
rooms = {}


@app.route('/room/<string:room_id>', methods=['GET'])
def get_room(room_id: str):
    if room_id not in rooms:
        print(f"Error: room {room_id} not found ({rooms})")
        return jsonify({"status": "error", "errors": "room not found"})
    
    return jsonify(rooms[room_id])


@app.route('/room', methods=['POST'])
def create_room():
    form = room_form.RoomForm(request.form)
    if not form.validate():
        print(f"Error: invalid form {form.data}")
        return jsonify({"status": "error", "errors": form.errors})
    
    data = form.data
    room_id = data['id']
    if room_id in rooms:
        print(f"Error: room {room_id} already exists ({rooms})")
        return jsonify({"status": "error", "errors": "room already exists"})
    
    if data['theme'] is None or data['topic1'] is None or data['topic2'] is None:
        # テーマ情報がクライアントから渡されなかった場合
        topics_data_list = db.get_topics()
        topic_data = random.choice(topics_data_list)
        theme = topic_data['theme']

        randval = random.randint(0, 1)
        if randval == 0:
            wolf_topic = topic_data['topic1']
            non_wolf_topic = topic_data['topic2']
        else:
            wolf_topic = topic_data['topic2']
            non_wolf_topic = topic_data['topic1']
    else:
        # テーマ情報がクライアントから渡された場合
        theme = data['theme']

        randval = random.randint(0, 1)
        if randval == 0:
            wolf_topic = data['topic1']
            non_wolf_topic = data['topic2']
        else:
            wolf_topic = data['topic2']
            non_wolf_topic = data['topic1']
    
    rooms[room_id] = {
        'id': room_id,
        'name': data['name'],
        'user_cnt': data['user_cnt'],
        'theme': theme,
        'wolf_topic': wolf_topic,
        'non_wolf_topic': non_wolf_topic,
    }

    print(f"Created room {room_id} ({rooms})")

    return jsonify({"status": "success"})
