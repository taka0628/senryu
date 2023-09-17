import { Grid, GridItem, Text, Select } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { MutableRefObject, useState } from 'react';
import { Socket } from 'socket.io-client';

import styles from '@/app/page.module.css';
import { ActionButton } from '@/component/actionButton';
import { Tanzaku } from '@/component/tanzaku';
import { Timer } from '@/component/timer';

import { Waiting } from './waiting';

interface TalkingProps {
  users: User[];
  socketRef: MutableRefObject<Socket | undefined>;
}
interface User {
  id: string;
  name: string;
  senryu: string;
}

export const Talking: React.FC<TalkingProps> = ({ users, socketRef }) => {
  const roomId = usePathname();
  const [isWaiting, setIswaiting] = useState(false);
  const [voted, setVoted] = useState('');
  const finish = () => {
    socketRef.current?.emit('poll', {
      room_id: roomId.slice(1),
      post_player_id: voted,
    });
    console.log(users);
    setIswaiting(true);
  };
  const vote = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setVoted(e.target.value);
  };
  return (
    <>
      {isWaiting ? (
        <Waiting message={'他の参加者の投票'} />
      ) : (
        <Grid templateRows='1fr 1fr 1fr 1fr 10fr' h='100vh'>
          <GridItem w='100%' h='10%' className={styles['center']}>
            <Select placeholder='ウルフ選択' onChange={(e) => vote(e)}>
              {users.map((u, i) => {
                return (
                  <option value={u.id} key={i}>
                    {u.name}
                  </option>
                );
              })}
            </Select>
          </GridItem>{' '}
          <GridItem w='100%' h='10%' className={styles['center']}>
            <Text fontSize='3xl' className={styles['title']}>
              投票
            </Text>
          </GridItem>
          <GridItem w='100%' h='10%' className={styles['center']}>
            <Timer limit={180} action={finish} />
          </GridItem>
          <GridItem w='100%' h='10%' className={styles['center']}>
            <ActionButton action={finish} title={'終了'} />
          </GridItem>
          <GridItem w='100%' h='100%' className={styles['tanzakuContainer']}>
            {users.map((u, i) => {
              let senryu;
              if (u.senryu) {
                senryu = u.senryu;
              } else {
                senryu = '';
              }
              const splitSenryu = senryu.split('\n');
              let kami;
              if (splitSenryu[0]) {
                kami = splitSenryu[0];
              } else {
                kami = '';
              }
              let naka;
              if (splitSenryu[1]) {
                naka = splitSenryu[1];
              } else {
                naka = '';
              }
              let shimo;
              if (splitSenryu[2]) {
                shimo = splitSenryu[2];
              } else {
                shimo = '';
              }
              return (
                <Tanzaku
                  kami={kami}
                  naka={naka}
                  shimo={shimo}
                  name={u.name}
                  key={i}
                />
              );
            })}
          </GridItem>
        </Grid>
      )}
    </>
  );
};
