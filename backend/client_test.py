import uuid

import requests
import socketio

import migrate_db

# 各種変数
SERVER_URL = 'http://localhost:8888'
ROOM_ID = str(uuid.uuid1())
ROOM_DATA = {
    'id': ROOM_ID,
    'name': 'hoge hoge room',
    'user_cnt': 2,
    'theme': 'プログラミング言語',
    'topic1': 'Python',
    'topic2': 'Java',
}
USERNAME1 = 'player1'
USERNAME2 = 'player2'


# 1. テスト前にデータベースを初期化
migrate_db.reset_database()


# 2. ルーム作成
r = requests.post(
    f"{SERVER_URL}/room",
    data=ROOM_DATA
)
r.raise_for_status()
assert 'errors' not in r.json()


# 3. ルーム取得
r = requests.get(
    f"{SERVER_URL}/room/{ROOM_ID}",
)
r.raise_for_status()
j = r.json()
assert j['id'] == ROOM_DATA['id']
assert j['name'] == ROOM_DATA['name']
assert j['user_cnt'] == ROOM_DATA['user_cnt']
# TODO: テーマ未指定の場合は変える
assert j['theme'] == ROOM_DATA['theme']
assert j['wolf_topic'] in [ROOM_DATA['topic1'], ROOM_DATA['topic2']]
assert j['non_wolf_topic'] in [ROOM_DATA['topic1'], ROOM_DATA['topic2']]
assert j['wolf_topic'] != j['non_wolf_topic']


# 4. ソケット通信 (player1)
sio1 = socketio.Client()

@sio1.on('connect')
def connect1():
    print('[connect1]')

@sio1.on('gather_member')
def gather_member1(data):
    print('[gather member1]', data)
    sio1.emit('post_senryu', {
        'room_id': ROOM_ID,
        'senryu': 'あああああ\nあああああああ\nあああああ'
    })

@sio1.on('collect_senryu')
def collect_senryu1(data):
    print('[collect senryu1]', data)
    sio1.emit('poll', {
        'room_id': ROOM_ID,
        'post_player_id': data[list(data.keys())[0]]['id'],
    })

@sio1.on('collect_polls')
def collect_polls1(data):
    print('[collect polls1]', data)
    print('[finish1]')

sio1.connect(SERVER_URL)


# 4. ソケット通信 (player2)
sio2 = socketio.Client()

@sio2.on('connect')
def connect2():
    print('[connect2]')

@sio2.on('gather_member')
def gather_member2(data):
    print('[gather member2]', data)
    sio2.emit('post_senryu', {
        'room_id': ROOM_ID,
        'senryu': 'いいいいい\nいいいいいいい\nいいいいい'
    })

@sio2.on('collect_senryu')
def collect_senryu2(data):
    print('[collect senryu2]', data)
    sio2.emit('poll', {
        'room_id': ROOM_ID,
        'post_player_id': data[list(data.keys())[0]]['id'],
    })

@sio2.on('collect_polls')
def collect_polls2(data):
    print('[collect polls2]', data)
    print('[finish2]')

sio2.connect(SERVER_URL)


# 5. 参加
sio1.emit('join_room', {
    'room_id': ROOM_ID,
    'name': USERNAME1,
})
sio2.emit('join_room', {
    'room_id': ROOM_ID,
    'name': USERNAME2,
})

sio1.wait()
sio2.wait()
