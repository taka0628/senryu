'use client';
import { Grid, GridItem, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { ActionButton } from '@/component/actionButton';
import axios from '@/utils/axios';

import styles from './page.module.css';

export default function CreateRoomPage() {
  const generateUniqueId = () => {
    return (
      new Date().getTime().toString(16) +
      Math.floor(Math.random() * 10).toString()
    );
  };

  const router = useRouter();

  const onClick = () => {
    const room_id = generateUniqueId();
    router.push(`/${room_id}`);
    axios.post('room').then((res) => {
      if (res.data.status === 200) {
        router.push(`/${room_id}`);
      }
    });
  };

  return (
    <Grid templateRows='repeat(4)' h='100vh'>
      <GridItem w='100%' h='20%' className={styles.center}>
        <Text fontSize='5xl' className={styles.title}>
          川柳ウルフ
        </Text>
      </GridItem>
      <GridItem w='100%' h='10%' className={styles.center}>
        <ActionButton action={onClick} title={'ルームを作成する'} />
      </GridItem>
    </Grid>
  );
}
