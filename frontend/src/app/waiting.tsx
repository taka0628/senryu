import { Grid, GridItem, Input, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line import/named
import { ActionButton } from '@/component/actionButton';

import styles from './page.module.css';

interface WaitingProps {
  setProgress: Dispatch<SetStateAction<string>>;
}

export const Waiting: React.FC<WaitingProps> = ({ setProgress }) => {
  const socketRef = useRef<WebSocket>();
  const [isConnected, setIsConnected] = useState(false);
  const [roomID, setRoomID] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerList, setPlayerList] = useState('');

  const sendData = () => {
    socketRef.current?.send(roomID);
    socketRef.current?.send(playerName);
    setProgress('ingame');
  };

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:5000');
    socketRef.current = websocket;
    websocket.onopen = function () {
      setIsConnected(true);
      console.log('Connected');
    };

    //接続が切れた時
    websocket.close = function () {
      console.log('closed');
      setIsConnected(false);
    };

    // server 側から送られてきたデータを受け取る
    websocket.onmessage = function (event) {
      setPlayerList(event.data);
    };

    return () => {
      if (socketRef.current === null) {
        return;
      }
      websocket.close();
    };
  }, []);

  const onChangeRoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomID(e.target.value);
  };
  const onChangePlayer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  return (
    <Grid templateRows='repeat(4)' h='100vh'>
      <GridItem w='100%' h='20%' className={styles.center}>
        <Text fontSize='5xl' className={styles.title}>
          タイトル
        </Text>
      </GridItem>
      <GridItem w='100%' h='60%' className={styles.center}>
        <Input
          value={roomID}
          onChange={onChangeRoom}
          placeholder='ルーム名'
          size='lg'
          className={styles.inputBox}
        />
      </GridItem>
      <GridItem w='100%' h='10%' className={styles.center}>
        <Input
          value={playerName}
          onChange={onChangePlayer}
          placeholder='プレイヤー名'
          size='lg'
          className={styles.inputBox}
        />
      </GridItem>
      <GridItem w='100%' h='10%' className={styles.center}>
        <ActionButton action={sendData} title={'入室する'} />
      </GridItem>
    </Grid>
  );
};
