'use client';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';

import { InGame } from './inGame';
import { Talking } from './talking';
import { Waiting } from './waiting';
export default function Home() {
  const [progress, setProgress] = useState('waiting');
  return (
    <RecoilRoot>
      {progress === 'waiting' && <Waiting setProgress={setProgress} />}
      {progress === 'ingame' && <InGame setProgress={setProgress} />}
      {progress === 'talking' && <Talking setProgress={setProgress} />}
    </RecoilRoot>
  );
}
