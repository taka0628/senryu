import { Dispatch, SetStateAction } from 'react';
import { useRecoilValue } from 'recoil';

import { usersAtom } from '@/recoil/atoms/users';
import axios from '@/utils/axios';

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
    users.forEach((user) => {
      const form = new FormData();
      form.append('game_id', '1');
      form.append('senryu', user.senryu ? user.senryu : '');
      form.append('topic', user.topic ? user.topic : '');
      form.append('is_wolf', user.topic === topics.wolf ? 'true' : 'false');
      axios
        .post('result', form)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    });
    setProgress('waiting');
  };

  const CivilList = () => {
    return (
      <>
        <div>{topics.civil}</div>
        {users
          .filter((user) => {
            return user.topic === topics.civil;
          })
          .map((user, i) => {
            return <div key={i}>{user.name}</div>;
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
