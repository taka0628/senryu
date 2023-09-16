'use client';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';

// eslint-disable-next-line import/namespace
import { InGame } from './inGame';
import { Result } from './result';
import { Talking } from './talking';
import { Waiting } from './waiting';
export default function Home() {
  const topics = {
    wolf: '水',
    civil: 'お湯',
  };
  const senryu = [
    'あああああ\nあああああああ\nあああああ',
    'いいいいい\nあああああああ\nあああああ',
    'ううううう\nあああああああ\nあああああ',
    'えええええ\nあああああああ\nあああああ',
  ];
  const [progress, setProgress] = useState('waiting');
  return (
    <RecoilRoot>
      {progress === 'waiting' && <Waiting setProgress={setProgress} />}
      {progress === 'ingame' && (
        <InGame setProgress={setProgress} topics={topics} />
      )}
      {progress === 'talking' && (
        <Talking setProgress={setProgress} senryu={senryu} />
      )}
      {progress === 'result' && (
        <Result setProgress={setProgress} topics={topics} />
      )}
    </RecoilRoot>
  );
}
