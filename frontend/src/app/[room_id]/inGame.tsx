import { Grid, GridItem, Text, Textarea } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { Dispatch, MutableRefObject, SetStateAction, useState } from 'react';
import { Socket } from 'socket.io-client';

import { Waiting } from '@/app/[room_id]/waiting';
import styles from '@/app/page.module.css';
import { ActionButton } from '@/component/actionButton';
import { Timer } from '@/component/timer';

interface InGameProps {
  setProgress: Dispatch<SetStateAction<string>>;
  socketRef: MutableRefObject<Socket | undefined>;
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
  socketRef: MutableRefObject<Socket | undefined>;
  topic: string;
}

const CreateSenryu: React.FC<CreateSenryuProps> = ({ socketRef, topic }) => {
  const [text, setText] = useState('');
  const [isWaiting, setIswaiting] = useState(false);
  const roomId = usePathname();

  const onClick = () => {
    setIswaiting(true);
      console.log(socketRef)
    //川柳を投稿
    socketRef.current?.emit('post_senryu', {
      room_id: roomId.slice(1),
      senryu: text,
    });
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  return isWaiting ? (
    <Waiting message={'他のメンバーの入力'} />
  ) : (
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
