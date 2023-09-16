import { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface TalkingProps {
  setProgress: Dispatch<SetStateAction<string>>;
}
export const Talking: React.FC<TalkingProps> = ({ setProgress }) => {
  const [time, setTime] = useState(5);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevState) => prevState - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (time === 0) {
      setProgress('result');
    }
  }, [time, setProgress]);
  return <div>{`${time}`}</div>;
};
