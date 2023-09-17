'use client';
import { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';

import axios from '@/utils/axios';

import { InGame } from './inGame';
import { Result } from './result';
import { Talking } from './talking';
import { Waiting } from './waiting';
export default function Home() {
  const [progress, setProgress] = useState('waiting');
  const [topic, setTopic] = useState({ wolf: '', civil: '' });

  useEffect(() => {
    axios
      .get('topic')
      .then((res) => {
        console.log(res);
        if (Math.random() > 0.5) {
          setTopic({
            wolf: res.data.topic1,
            civil: res.data.topic2,
          });
        } else {
          setTopic({
            wolf: res.data.topic2,
            civil: res.data.topic1,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <RecoilRoot>
      {progress === 'waiting' && <Waiting setProgress={setProgress} />}
      {progress === 'ingame' && (
        <InGame setProgress={setProgress} topics={topic} />
      )}
      {progress === 'talking' && <Talking setProgress={setProgress} />}
      {progress === 'result' && (
        <Result setProgress={setProgress} topics={topic} />
      )}
    </RecoilRoot>
  );
}
