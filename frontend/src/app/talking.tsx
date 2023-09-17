import { Grid, GridItem, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { useRecoilState } from 'recoil';

import styles from '@/app/page.module.css';
import { ActionButton } from '@/component/actionButton';
import { Tanzaku } from '@/component/tanzaku';
import { Timer } from '@/component/timer';
import { usersAtom } from '@/recoil/atoms/users';

interface TalkingProps {
  setProgress: Dispatch<SetStateAction<string>>;
  senryu: Array<string>;
}

export const Talking: React.FC<TalkingProps> = ({ setProgress }) => {
  const [users] = useRecoilState(usersAtom);
  const finish = () => {
    setProgress('result');
  };
  return (
    <Grid templateRows='1fr 1fr 1fr 3fr' h='100vh'>
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
        {users.map((u) => {
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
          // eslint-disable-next-line react/jsx-key
          return <Tanzaku kami={kami} naka={naka} shimo={shimo} />;
        })}
      </GridItem>
    </Grid>
  );
};
