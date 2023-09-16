import { Card, CardBody } from '@chakra-ui/card';
import { Text } from '@chakra-ui/react';
import React from 'react';

interface tanzakuProps {
  senryu: string;
}
export const Tanzaku: React.FC<tanzakuProps> = ({ senryu }) => {
  return (
    <Card>
      <CardBody>
        <Text>{senryu}</Text>
      </CardBody>
    </Card>
  );
};
