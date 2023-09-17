import { Grid, GridItem, Text, Textarea } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import styles from '@/app/page.module.css';
import { ActionButton } from '@/component/actionButton';
import { Timer } from '@/component/timer';

interface InGameProps {
  setProgress: Dispatch<SetStateAction<string>>;
  socketRef: React.RefObject<Socket>;
  topic: string;
}
export const InGame: React.FC<InGameProps> = ({
  setProgress,
  socketRef,
  topic,
}) => {
  return (
    <CreateSenryu
      socketRef={socketRef}
      setProgress={setProgress}
      topic={topic}
    />
  );
};

interface CreateSenryuProps {
  socketRef: React.RefObject<Socket>;
  setProgress: Dispatch<SetStateAction<string>>;
  setSenryuList: Dispatch<SetStateAction<Data>>;
  topic: string;
}

interface Data {
  senryuList: Array<SenryuList>;
}

interface SenryuList {
  id: string;
  name: string;
  topic: string;
  senryu: string;
  is_wolf: boolean;
  session_id: string;
}
const CreateSenryu: React.FC<CreateSenryuProps> = ({
  socketRef,
  setProgress,
  setSenryuList,
  topic,
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('collect_senryu', () => {
        setProgress('talking');
      });
    }
  }, []);
  const onClick = () => {
    if (socketRef.current) {
      //川柳を投稿
      socketRef.current.emit('post_senryu', text);
      //川柳集合
      socketRef.current.on('collect_senryu', (data) => {
        setSenryuList(data);
        setProgress('talking');
      });
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  return (
    <Grid templateRows='repeat(5)' gap={'5%'} h='100vh'>
      <GridItem w='100%' h='10%' className={styles['center']}>
        <Text fontSize='3xl' className={styles['title']}>
          川柳を入力
        </Text>
      </GridItem>
      <GridItem w='100%' h='10%' className={styles['center']}>
        <Text fontSize='2xl'>お題:{topic}</Text>
      </GridItem>
      <GridItem w='100%' h='10%' className={styles['center']}>
        <Timer limit={300} action={onClick} />
      </GridItem>
      <GridItem w='100%' h='30%' className={styles['center']}>
        <Textarea
          placeholder='あああああ'
          value={text}
          onChange={onChange}
          className={styles.textaera}
        />
      </GridItem>
      <GridItem w='100%' h='20%' className={styles['center']}>
        <ActionButton action={onClick} title={'提出'} />
      </GridItem>
    </Grid>
  );
};
