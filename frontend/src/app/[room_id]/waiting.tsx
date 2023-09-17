import { GridItem, Text } from '@chakra-ui/react';

import styles from './page.module.css';

interface WaitingProps {
  message: string;
}

export const Waiting: React.FC<WaitingProps> = ({ message }) => {
  return (
    <GridItem w='100%' h='20%' className={styles.center}>
      <Text fontSize='5xl' className={styles.title}>
        {`${message}をお待ちください`}
      </Text>
    </GridItem>
  );
};
