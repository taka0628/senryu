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
        <InGame socketRef={socketRef} topic={topic} />
      )}
      {isConnected && progress === 'talking' && (
        <Talking socketRef={socketRef} />
      )}
      {isConnected && progress === 'result' && <Result socketRef={socketRef} />}
    </RecoilRoot>
  );
}
