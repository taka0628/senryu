import { Text } from '@chakra-ui/react';
import React from 'react';

import styles from '@/app/page.module.css';

interface tanzakuProps {
  kami: string;
  naka: string;
  shimo: string;
}
export const Tanzaku: React.FC<tanzakuProps> = ({ kami, naka, shimo }) => {
  return (
    <div className={styles.verticalBanner}>
      <Text fontSize='2xl' className={styles.verticalText}>
        {shimo}
      </Text>
      <Text fontSize='2xl' className={styles.verticalText}>
        {naka}
      </Text>
      <Text fontSize='2xl' className={styles.verticalText}>
        {kami}
      </Text>
    </div>
  );
};
