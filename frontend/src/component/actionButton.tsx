import { Button } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';

interface ButtonAction {
  action: MouseEventHandler<HTMLButtonElement>;
  title: string;
}

export const ActionButton: React.FC<ButtonAction> = ({ action, title }) => {
  return (
    <Button colorScheme='red' onClick={action}>
      {title}
    </Button>
  );
};
