'use client';
import { useEffect, useState, useRef } from 'react';
import { RecoilRoot } from 'recoil';
import { io, Socket } from 'socket.io-client';

import { InGame } from './inGame';
import { Result } from './result';
import { Talking } from './talking';
export default function Home() {
  const socketRef = useRef<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState('enter_room');
  const [senryuList, setSenryuList] = useState();
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
      {isConnected && progress === 'enter_room' && (
        <EnterRoom socketRef={socketRef} />
      )}
      {isConnected && progress === 'ingame' && (
        <InGame
          soektRef={socketRef}
          setProgress={setProgress}
          setSenryuList={setSenryuList}
        />
      )}
      {isConnected && progress === 'talking' && (
        <Talking socketRef={socketRef} senryuList={senryuList} />
      )}
      {isConnected && progress === 'result' && <Result socketRef={socketRef} />}
    </RecoilRoot>
  );
}
