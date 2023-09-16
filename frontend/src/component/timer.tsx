import { useEffect, useState } from 'react';

interface Timer {
  limit: number;
}
export const Timer: React.FC<Timer> = ({ limit }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [time, setTime] = useState(limit);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const timer = setInterval(() => {
      if (time > 0) {
        setTime(time - 1);
      }
    }, 1000);

    // クリーンアップ
    return () => {
      clearInterval(timer);
    };
  }, [time]);

  // 残り時間を分と秒に変換
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <div>
      <p>{formattedTime}</p>
    </div>
  );
};
