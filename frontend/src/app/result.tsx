import { Dispatch, SetStateAction } from 'react';
import { useRecoilValue } from 'recoil';

import { usersAtom } from '@/recoil/atoms/users';

interface ResultProps {
  setProgress: Dispatch<SetStateAction<string>>;
  topics: {
    wolf: string;
    civil: string;
  };
}

export const Result: React.FC<ResultProps> = ({ setProgress, topics }) => {
  const users = useRecoilValue(usersAtom);

  const onClick = () => {
    setProgress('waiting');
  };

  const CivilList = () => {
    return (
      <>
        <div>{`${topics.civil}`}</div>
        {users
          .filter((user) => {
            return user.topic === topics.civil;
          })
          .map((user, i) => {
            return <div key={i}>{`${user.name}`}</div>;
          })}
      </>
    );
  };
  const WolfList = () => {
    return (
      <>
        <div>{topics.wolf}</div>
        {users
          .filter((user) => {
            return user.topic === topics.wolf;
          })
          .map((user, i) => {
            return <div key={i}>{user.name}</div>;
          })}
      </>
    );
  };

  return (
    <>
      <div>結果発表</div>
      <CivilList />
      <WolfList />
      <button onClick={onClick}>ホームに戻る</button>
    </>
  );
};
