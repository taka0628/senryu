import { Grid, GridItem, Text } from '@chakra-ui/react';
import { DateTime } from '@markuplint/rules/lib/require-datetime/types';
import { Dispatch, SetStateAction } from 'react';

import styles from '@/app/page.module.css';
import { ActionButton } from '@/component/actionButton';

interface ResultProps {
  setProgress: Dispatch<SetStateAction<string>>;
  resultList: Array<ResultList>;
}

interface ResultList {
  id: string;
  dt: DateTime;
  room_id: string;
  username: string;
  post_username: string;
  senryu: string;
  topic: string;
  is_wolf: boolean;
}

export const Result: React.FC<ResultProps> = ({ setProgress, resultList }) => {
  const onClick = () => {
    setProgress('waiting');
  };

  const civilTopic = () => {
    let civil;
    resultList.map((user) => {
      if (user.is_wolf === false) {
        civil = user.topic;
      }
    });
    return civil;
  };

  const wolfTopic = () => {
    let wolf;
    resultList.map((user) => {
      if (user.is_wolf === true) {
        wolf = user.topic;
      }
    });
    return wolf;
  };

  const CivilList = () => {
    return (
      <>
        <div>{civilTopic}</div>
        {resultList
          .filter((user) => {
            return user.is_wolf === false;
          })
          .map((user, i) => {
            return <div key={i}>{user.username}</div>;
          })}
      </>
    );
  };
  const WolfList = () => {
    return (
      <>
        <div>{wolfTopic}</div>
        {resultList
          .filter((user) => {
            return user.is_wolf === true;
          })
          .map((user, i) => {
            return <div key={i}>{user.username}</div>;
          })}
      </>
    );
  };

  return (
    <Grid templateRows='repeat(4)' h='100vh'>
      <GridItem w='100%' h='20%' className={styles.center}>
        <Text fontSize='5xl' className={styles.title}>
          結果発表
        </Text>
      </GridItem>
      <GridItem w='100%' h='60%' className={styles.center}>
        <div>
          <CivilList />
          <WolfList />
        </div>
      </GridItem>
      <GridItem w='100%' h='20%' className={styles.center}>
        <ActionButton action={onClick} title={'ホームに戻る'} />
      </GridItem>
    </Grid>
  );
};
