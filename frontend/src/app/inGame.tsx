import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { usersAtom } from '@/recoil/atoms/users';

interface InGameProps {
  setProgress: Dispatch<SetStateAction<string>>;
  topics: {
    wolf: string;
    civil: string;
  };
}
export const InGame: React.FC<InGameProps> = ({ setProgress, topics }) => {
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
          ? { ...user, topic: topics.wolf }
          : { ...user, topic: topics.civil };
      });
    });
  }, [users.length, setUsers, topics]);

  useEffect(() => {
    if (currentUserIndex === users.length) {
      setProgress('talking');
    }
  }, [currentUserIndex, setProgress, users.length]);

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
    setConfirm(false);
    setCurrentUserIndex((prevState) => prevState + 1);
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  return (
    <>
      <div>{`${users[currentUserIndex]?.name}の番`}</div>
      <div>お題</div>
      <div>{`${users[currentUserIndex]?.topic}`}</div>
      <textarea value={text} onChange={onChange} />
      <button onClick={onClick}>submit</button>
    </>
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
