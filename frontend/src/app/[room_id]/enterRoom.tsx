import { Grid, GridItem, Input, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { MutableRefObject, useState } from 'react';
import { Socket } from 'socket.io-client';

import { ActionButton } from '@/component/actionButton';

import styles from './page.module.css';
import { Waiting } from './waiting';

interface EnterRoomProps {
  socketRef: MutableRefObject<Socket | undefined>;
  roomName: string;
}
export const EnterRoom: React.FC<EnterRoomProps> = ({
  socketRef,
  roomName,
}) => {
  const [name, setName] = useState('');
  const [isWaiting, setIswaiting] = useState(false);
  const roomId = usePathname();

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onClick = () => {
    setIswaiting(true);
    socketRef.current?.emit('join_room', {
      room_id: roomId.slice(1),
      name: name,
    });
  };

  return (
    <>
      {isWaiting ? (
        <Waiting message={'他のメンバーの参加'} />
      ) : (
        <Grid templateRows='repeat(3)' h='100vh'>
          <GridItem w='100%' h='20%' className={styles.center}>
            <Text fontSize='5xl' className={styles.title}>
              {roomName}
            </Text>
          </GridItem>
          <GridItem w='100%' h='20%' className={styles.center}>
            名前：
            <Input
              value={name}
              onChange={(e) => changeName(e)}
              className={styles.input}
            />
          </GridItem>
          <GridItem w='100%' h='10%' className={styles.center}>
            <ActionButton action={onClick} title={'ルーム入室'} />
          </GridItem>
        </Grid>
      )}
    </>
  );
};
