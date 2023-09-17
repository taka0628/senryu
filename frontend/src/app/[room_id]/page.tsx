'use client';
import { useEffect, useState, useRef } from 'react';
import { RecoilRoot } from 'recoil';
import { io, Socket } from 'socket.io-client';

import { EnterRoom } from './enterRoom';
import { InGame } from './inGame';
import { Result } from './result';
import { Talking } from './talking';
export default function Home() {
  const socketRef = useRef<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState('enter_room');
  useEffect(() => {
    const websocket = io('ws://localhost:5000');
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
    websocket.on('gather_member', () => {
      setProgress('ingame');
    });

    return () => {
      if (socketRef.current === null) {
        return;
      }
      websocket.emit('disconnect');
    };
  }, []);

  return (
    <RecoilRoot>
      <EnterRoom socketRef={socketRef} />
      {isConnected && progress === 'enter_room' && (
        <EnterRoom socketRef={socketRef} />
      )}
      {isConnected && progress === 'ingame' && <InGame socketRef={socketRef} />}
      {isConnected && progress === 'talking' && (
        <Talking socketRef={socketRef} />
      )}
      {isConnected && progress === 'result' && <Result socketRef={socketRef} />}
    </RecoilRoot>
  );
}
