import datetime
import random
import uuid

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

from models import room_form
from db import db, models

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = {}


@app.route("/results", methods=["GET"])
def get_results():
    topics_data = db.get_results()
    return jsonify(topics_data)


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
        'player_dict': {},
    }

    print(f"Created room {room_id} ({rooms[room_id]})")

    return jsonify(rooms[room_id])


@socketio.on('join_room')
def join_room(data):
    room_id = data['room_id']
    username = data['name']
    session_id = request.sid # type: ignore

    if room_id not in rooms:
        print(f"Error: room {room_id} not found ({rooms})")
        socketio.emit(
            'error', 
            {"status": "error", "errors": "room not found"}, 
            room=session_id
        )
        return
    elif len(rooms[room_id]['player_dict']) >= rooms[room_id]['user_cnt']:
        print(f"Error: room {room_id} is full ({rooms})")
        socketio.emit(
            'error', 
            {"status": "error", "errors": "room is full"}, 
            room=session_id
        )
        return
    
    # NOTE: 衝突する可能性あり
    is_wolf = len(rooms[room_id]['player_dict']) == rooms[room_id]['wolf_player_num']

    rooms[room_id]['player_dict'][session_id] = {
        'id': str(uuid.uuid4()),
        'name': username,
        'topic': rooms[room_id]['wolf_topic'] if is_wolf else rooms[room_id]['non_wolf_topic'],
        'senryu': None, # 川柳を受け取ったら値が入る
        'is_wolf': is_wolf,
        'session_id': session_id,
    }

    if len(rooms[room_id]['player_dict']) == rooms[room_id]['user_cnt']:
        # 全員揃ったら各プレイヤーにゲーム開始を通知
        print(f"Game started in room {room_id} ({rooms[room_id]})")
        for player_info in rooms[room_id]['player_dict'].values():
            # 各プレイヤーにゲーム開始を通知
            socketio.emit(
                'gather_member', 
                player_info, 
                room=player_info['session_id']
            )
        return


@socketio.on('post_senryu')
def post_senryu(data):
    room_id = data['room_id']
    senryu = data['senryu']
    session_id = request.sid # type: ignore

    if room_id not in rooms:
        print(f"Error: room {room_id} not found ({rooms})")
        socketio.emit(
            'error', 
            {"status": "error", "errors": "room not found"}, 
            room=session_id,
        )
        return 
    elif session_id not in rooms[room_id]['player_dict']:
        socketio.emit(
            'error', 
            {"status": "error", "errors": "session not found"}, 
            room=session_id,
        )
        return
    
    rooms[room_id]['player_dict'][session_id]['senryu'] = senryu
    print(f"Update player senryu: {rooms[room_id]['player_dict'][session_id]}")

    # すべての川柳が集まったら
    is_collected_all_senryu = all(
        [player['senryu'] is not None for player in rooms[room_id]['player_dict']])
    if is_collected_all_senryu:
        for player_info in rooms[room_id]['player_dict'].values():
            # 各プレイヤーに川柳を送信
            print(f"Send senryu to player: {player_info}")
            socketio.emit(
                'collect_senryu',
                rooms[room_id]['player_dict'], 
                room=player_info['session_id'],
            )


@socketio.on('poll')
def poll(data):
    room_id = data['room_id']
    post_player_id = data['post_player_id']
    session_id = request.sid # type: ignore

    post_player_info = None
    for value in rooms[room_id]['player_dict'].values():
        if value['id'] == post_player_id:
            post_player_info = value

    if session_id not in rooms[room_id]['player_dict']:
        socketio.emit(
            'error', 
            {"status": "error", "errors": "player_id not found"}, 
            room=session_id,
        )
        return
    elif post_player_info is None:
        socketio.emit(
            'error', 
            {"status": "error", "errors": "post_player_id not found"}, 
            room=session_id,
        )
        return

    player_info = rooms[room_id]['player_dict'][session_id]

    result_data = models.result(
        dt=datetime.datetime.now(),
        room_id=room_id,
        username=player_info['name'],
        post_username=post_player_info['name'],
        senryu=player_info['senryu'],
        topic=player_info['topic'],
        is_wolf=player_info['is_wolf'],
    )
    db.add_result(result_data)

    results = db.get_room_results(room_id)
    if len(results) == len(rooms[room_id]['player_dict']):
        # 全員の投票が集まったら
        socketio.emit(
            'collect_polls',
            results,
            room=session_id,
        )
        return


if __name__ == "__main__":
    socketio.run(app, port='8888', host='0.0.0.0', debug=True, allow_unsafe_werkzeug=True)
