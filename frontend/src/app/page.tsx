'use client';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';

import { InGame } from './inGame';
import { Result } from './result';
import { Talking } from './talking';
import { Waiting } from './waiting';
export default function Home() {
  const topics = {
    wolf: '水',
    civil: 'お湯',
  };
  const [progress, setProgress] = useState('waiting');
  return (
    <RecoilRoot>
      {progress === 'waiting' && <Waiting setProgress={setProgress} />}
      {progress === 'ingame' && (
        <InGame setProgress={setProgress} topics={topics} />
      )}
      {progress === 'talking' && <Talking setProgress={setProgress} />}
      {progress === 'result' && (
        <Result setProgress={setProgress} topics={topics} />
      )}
    </RecoilRoot>
  );
}
