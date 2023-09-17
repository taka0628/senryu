import random
import uuid

from flask import Blueprint, jsonify, request

from main import socketio
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
        topic_data = db.get_topic()
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
        'wolf_player_num': random.randint(0, data['user_cnt'] - 1),
        'player_list': [],
    }

    print(f"Created room {room_id} ({rooms[room_id]})")

    return jsonify(rooms[room_id])


@socketio.on('join_room')
def join_room(data):
    room_id = data['room_id']
    username = data['name']
    # TODO: session_idをプレイや情報にいれて、送信時もそれを使う
    session_id = request.sid # type: ignore

    if room_id not in rooms:
        print(f"Error: room {room_id} not found ({rooms})")
        socketio.emit('error', {"status": "error", "errors": "room not found"})
        return
    elif len(rooms[room_id]['player_list']) >= rooms[room_id]['user_cnt']:
        print(f"Error: room {room_id} is full ({rooms})")
        socketio.emit('error', {"status": "error", "errors": "room is full"})
        return
    
    # NOTE: 衝突する可能性あり
    is_wolf = len(rooms[room_id]['player_list']) == rooms[room_id]['wolf_player_num']

    rooms[room_id]['player_list'].append({
        'id': str(uuid.uuid4()),
        'name': username,
        'topic': rooms[room_id]['wolf_topic'] if is_wolf else rooms[room_id]['non_wolf_topic'],
        'senryu': None, # 川柳を受け取ったら値が入る
        'is_wolf': is_wolf,
    })

    if len(rooms[room_id]['player_list']) == rooms[room_id]['user_cnt']:
        # 全員揃ったらゲーム開始
        print(f"Game started in room {room_id} ({rooms[room_id]})")
        socketio.emit('gather_member', )
        return
