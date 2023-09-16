'use client';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';

import { CreateRoom } from './createRoom';
export default function Home() {
  const [progress, setProgress] = useState('waiting');
  return (
    <RecoilRoot>
      {progress === 'waiting' && <CreateRoom setProgress={setProgress} />}
    </RecoilRoot>
  );
}
