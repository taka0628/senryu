'use client';
import { Grid, GridItem, Text, Input } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ActionButton } from '@/component/actionButton';
import axios from '@/utils/axios';

import styles from './page.module.css';

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [playerNum, setPlayerNum] = useState('1');

  const changeRoomName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const changePlayerNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerNum(e.target.value);
  };

  const onClick = () => {
    const room_id = crypto.randomUUID();
    const form = new FormData();
    form.append('id', room_id);
    form.append('name', roomName ? roomName : '未設定');
    form.append('user_cnt', playerNum);
    axios
      .post('room', form)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          router.push(`/${room_id}`);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Grid templateRows='repeat(4)' h='100vh'>
      <GridItem w='100%' h='20%' className={styles.center}>
        <Text fontSize='5xl' className={styles.title}>
          川柳ウルフ
        </Text>
      </GridItem>
      <GridItem w='100%' h='20%' className={styles.center}>
        ルームの名前:
        <Input
          value={roomName}
          onChange={(e) => changeRoomName(e)}
          className={styles.input}
        />
      </GridItem>
      <GridItem w='100%' h='20%' className={styles.center}>
        人数:
        <Input
          value={playerNum}
          onChange={(e) => changePlayerNum(e)}
          className={styles.input}
        />
      </GridItem>
      <GridItem w='100%' h='10%' className={styles.center}>
        <ActionButton action={onClick} title={'ルームを作成する'} />
      </GridItem>
    </Grid>
  );
}
