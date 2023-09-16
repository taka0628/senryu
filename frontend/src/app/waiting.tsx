import { Dispatch, SetStateAction, useState } from 'react';
import { useRecoilState } from 'recoil';

import { usersAtom } from '@/recoil/atoms/users';

interface WaitingProps {
  setProgress: Dispatch<SetStateAction<string>>;
}

export const Waiting: React.FC<WaitingProps> = ({ setProgress }) => {
  const [users, setUsers] = useRecoilState(usersAtom);
  const [numPlayers, setNumPlayers] = useState(1);

  const addPlayer = () => {
    setUsers((prevState) => [...prevState, { name: `Guest${numPlayers + 1}` }]);
    setNumPlayers((prevState) => prevState + 1);
  };

  const start = () => {
    setProgress('ingame');
  };

  const UserList = () => {
    return (
      <>
        {users.map((user, i) => {
          return <div key={i}>{user.name}</div>;
        })}
      </>
    );
  };
  return (
    <>
      <UserList />
      <button onClick={addPlayer}>プレイヤーを追加</button>
      <button onClick={start}>start</button>
    </>
  );
};
