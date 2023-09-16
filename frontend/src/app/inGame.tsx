import { Grid, GridItem, Text, Textarea } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

import styles from '@/app/page.module.css';
import { ActionButton } from '@/component/actionButton';
import { Timer } from '@/component/timer';
import { usersAtom } from '@/recoil/atoms/users';

interface InGameProps {
  setProgress: Dispatch<SetStateAction<string>>;
}
export const InGame: React.FC<InGameProps> = ({ setProgress }) => {
  const topics: string[] = useMemo(() => ['水', 'お湯'], []);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [users, setUsers] = useRecoilState(usersAtom);
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  useEffect(() => {
    const wolfIndex = getRandomInt(users.length);
    setUsers((prevState) => {
      return prevState.map((user, i) => {
        return i === wolfIndex
          ? { ...user, topic: topics[0] }
          : { ...user, topic: topics[1] };
      });
    });
  }, [users.length, setUsers, topics]);

  useEffect(() => {
    if (currentUserIndex === users.length) {
      setProgress('talking');
    }
  }, [currentUserIndex, setProgress, users.length]);

  useEffect(() => {
    console.log(confirm);
  }, [confirm]);
  return (
    <>
      {confirm ? (
        <CreateSenryu
          currentUserIndex={currentUserIndex}
          setCurrentUserIndex={setCurrentUserIndex}
          setConfirm={setConfirm}
        />
      ) : (
        <ConfirmPlayer
          name={users[currentUserIndex]?.name}
          setConfirm={setConfirm}
        />
      )}
    </>
  );
};

interface CreateSenryuProps {
  currentUserIndex: number;
  setCurrentUserIndex: Dispatch<SetStateAction<number>>;
  setConfirm: Dispatch<SetStateAction<boolean>>;
}
const CreateSenryu: React.FC<CreateSenryuProps> = ({
  currentUserIndex,
  setCurrentUserIndex,
  setConfirm,
}) => {
  const [users, setUsers] = useRecoilState(usersAtom);
  const [text, setText] = useState('');

  const onClick = () => {
    setUsers((prevState) => {
      return prevState.map((user, i) => {
        return i === currentUserIndex ? { ...user, senryu: text } : user;
      });
    });
    console.log(users);
    setConfirm(false);
    setCurrentUserIndex((prevState) => prevState + 1);
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  return (
    <Grid templateRows='repeat(5, 1fr)' gap={'5%'} h='100vh'>
      <GridItem w='100%' h='10%' className={styles.center}>
        <Text fontSize='3xl'>{`${users[currentUserIndex]?.name}の番`}</Text>
      </GridItem>
      <GridItem w='100%' h='10%' className={styles.center}>
        <Text fontSize='2xl'>お題:{`${users[currentUserIndex]?.topic}`}</Text>
      </GridItem>
      <GridItem w='100%' h='10%' className={styles.center}>
        <Timer limit={300} action={onClick} />
      </GridItem>
      <GridItem w='100%' h='30%' className={styles.center}>
        <Textarea
          placeholder='あああああ'
          value={text}
          onChange={onChange}
          className={styles.textaera}
        />
      </GridItem>
      <GridItem w='100%' h='20%' className={styles.center}>
        <ActionButton action={onClick} title={'提出'} />
      </GridItem>
    </Grid>
  );
};

interface ConfirmPlayerProps {
  name: string | undefined;
  setConfirm: Dispatch<SetStateAction<boolean>>;
}
const ConfirmPlayer: React.FC<ConfirmPlayerProps> = ({ name, setConfirm }) => {
  const onClick = () => {
    setConfirm(true);
  };

  return (
    <>
      <div>{`${name}の番です`}</div>
      <button onClick={onClick}>OK</button>
    </>
  );
};
