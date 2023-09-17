import { Grid, GridItem, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

import styles from '@/app/page.module.css';
import { Tanzaku } from '@/component/tanzaku';
import { Timer } from '@/component/timer';

interface TalkingProps {
  setProgress: Dispatch<SetStateAction<string>>;
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

export const Talking: React.FC<TalkingProps> = ({
  setProgress,
  senryuList,
}) => {
  const finish = () => {
    setProgress('result');
  };
  return (
    <Grid templateRows='repeat(3)' h='100vh'>
      <GridItem w='100%' h='10%' className={styles.center}>
        <Text fontSize='3xl' className={styles.title}>
          投票
        </Text>
      </GridItem>
      <GridItem w='100%' h='10%' className={styles.center}>
        <Timer limit={10} action={finish} />
      </GridItem>
      <GridItem w='100%' h='100%' className={styles.tanzakuContainer}>
        {senryuList.map((s) => {
          const senryu = s.senryu;
          const splittedStrings = senryu.split('\n');
          const kami = splittedStrings[0];
          const naka = splittedStrings[1];
          const shimo = splittedStrings[2];
          // eslint-disable-next-line react/jsx-key
          return <Tanzaku kami={kami} naka={naka} shimo={shimo} />;
        })}
      </GridItem>
    </Grid>
  );
};
