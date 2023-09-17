'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { RecoilRoot } from 'recoil';
import { io, Socket } from 'socket.io-client';

import axios from '@/utils/axios';
import { API_BASE_URL_PROD } from '@/utils/config';

import { EnterRoom } from './enterRoom';
import { InGame } from './inGame';
import { Result } from './result';
import { Talking } from './talking';
export default function Home() {
  const roomId = usePathname();
  const [roomName, setRoomName] = useState('');
  const [topic, setTopic] = useState('');
  const socketRef = useRef<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState('enter_room');
  const [senryuList, setSenryuList] = useState();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios
      .get(`room${roomId}`)
      .then((res) => {
        console.log(res);
        setRoomName(res.data.name);
      })
      .catch((e) => {
        console.log(e);
      });
    const websocket = io(API_BASE_URL_PROD);
    socketRef.current = websocket;

    websocket.on('connect', function () {
      setIsConnected(true);
      console.log('Connected');
    });

    //接続が切れた時
    websocket.on('disconnect', function () {
      console.log('closed');
      setIsConnected(false);
    });

    // メンバーが集まったらゲーム開始
    websocket.on('gather_member', (data) => {
      setProgress('ingame');
      setTopic(data.topic);
      console.log(data);
    });

    //川柳が揃ったら
    websocket.on('collect_senryu', (data) => {
      const user = [];
      setSenryuList(data);
      console.log(Object.values(data));

      Object.values(data).forEach((u) => {
        console.log(u);
        user.push({
          id: u.id,
          name: u.name,
          senryu: u.senryu,
        });
      });
      setUsers(user);
      setProgress('talking');
    });

    websocket.on('error', (data) => {
      console.log(data);
    });

    return () => {
      if (socketRef.current === null) {
        return;
      }
    };
  }, [roomId]);

  return (
    <RecoilRoot>
      {isConnected && progress === 'enter_room' && (
        <EnterRoom socketRef={socketRef} roomName={roomName} />
      )}
      {isConnected && progress === 'ingame' && (
        <InGame
          socketRef={socketRef}
          setProgress={setProgress}
          setSenryuList={setSenryuList}
          topic={topic}
        />
      )}
      {isConnected && progress === 'talking' && (
        <Talking socketRef={socketRef} users={users} />
      )}
      {isConnected && progress === 'result' && <Result socketRef={socketRef} />}
    </RecoilRoot>
  );
}
