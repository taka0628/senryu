import datetime

from flask import Blueprint, request

from api import rooms
from main import socketio

app = Blueprint("senryu", __name__)


@socketio.on('collect_senryu')
def collect_senryu(data):
    room_id = data['room_id']
    senryu = data['senryu']
    session_id = request.sid # type: ignore

    if room_id not in rooms.rooms:
        print(f"Error: room {room_id} not found ({rooms.rooms})")
        socketio.emit(
            'error', 
            {"status": "error", "errors": "room not found"}, 
            room=session_id,
        )
        return 
    elif session_id not in rooms.rooms[room_id]['player_dict']:
        socketio.emit(
            'error', 
            {"status": "error", "errors": "session not found"}, 
            room=session_id,
        )
        return
    
    rooms.rooms[room_id]['player_dict'][session_id]['senryu'] = senryu
    print(f"Update player senryu: {rooms.rooms[room_id]['player_dict'][session_id]}")

    # すべての川柳が集まったら
    is_collected_all_senryu = all(
        [player['senryu'] is not None for player in rooms.rooms[room_id]['player_dict']])
    if is_collected_all_senryu:
        for player_info in rooms.rooms[room_id]['player_dict'].values():
            # 各プレイヤーに川柳を送信
            print(f"Send senryu to player: {player_info}")
            socketio.emit(
                'post_senryu',
                rooms.rooms[room_id]['player_dict'], 
                room=player_info['session_id'],
            )


@socketio.on('collect_polls')
def collect_polls(data):
    poll = data['poll']
    room_id = poll['room_id']
    player_id = poll['player_id']
    post_player_id = poll['post_player_id']
    session_id = request.sid # type: ignore

    if player_id not in rooms.rooms[room_id]['player_dict']:
        socketio.emit(
            'error', 
            {"status": "error", "errors": "session not found"}, 
            room=session_id,
        )
        return

    player_info = rooms.rooms[room_id]['player_dict'][player_id]

    result_data = {
        'dt': datetime.datetime.now(),
        'room_id': room_id,
        'username': player_info['name'],
        'senryu': player_info['senryu'],
        'topic': player_info['topic'],
        'is_wolf': player_info['is_wolf'],
    }
    # TODO: DBに投票結果を保存

    # TODO: DBから投票結果を取得
    results = []

    if len(results) == len(rooms.rooms[room_id]['player_dict']):
        # 全員の投票が集まったら
        socketio.emit(
            'collect_polls',
            results,
            room=session_id,
        )
        return
