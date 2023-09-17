import { Grid, GridItem, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useRecoilState } from 'recoil';

// eslint-disable-next-line import/named
import { ActionButton } from '@/component/actionButton';
import { usersAtom } from '@/recoil/atoms/users';

import styles from './page.module.css';

interface WaitingProps {
  setProgress: Dispatch<SetStateAction<string>>;
}

export const Waiting: React.FC<WaitingProps> = ({ setProgress }) => {
  const [users, setUsers] = useRecoilState(usersAtom);
  const [numPlayers, setNumPlayers] = useState(1);

  const addPlayer = () => {
    setUsers((prevState) => [...prevState, { name: `Guest${numPlayers + 1}` }]);
    setNumPlayers((prevState) => prevState + 1);
  };

  const start = () => {
    setProgress('ingame');
  };

  const UserList = () => {
    return (
      <>
        {users.map((user, i) => {
          return <div key={i}>{user.name}</div>;
        })}
      </>
    );
  };
  return (
    <Grid templateRows='1fr 3fr 1fr 1fr' gap={4} h='100vh'>
      <GridItem w='100%' h='20%' className={styles['center']}>
        <Text fontSize='5xl' className={styles['title']}>
          川柳ウルフ
        </Text>
      </GridItem>
      <GridItem w='100%' h='60%' className={styles['center']}>
        <div>
          <UserList />
        </div>
      </GridItem>
      <GridItem w='100%' h='10%' className={styles['center']}>
        <ActionButton action={addPlayer} title={'プレイヤーを追加'} />
      </GridItem>
      <GridItem w='100%' h='10%' className={styles['center']}>
        <ActionButton action={start} title={'ゲームを始める'} />
      </GridItem>
    </Grid>
  );
};
