'use client';
import { useEffect, useState } from 'react';

import axios from '@/utils/axios';

interface ReaultType {
  id: number;
  game_id: number;
  senryu: string;
  topic: string;
  is_wolf: boolean;
}

export default function ResultPage() {
  const [results, setResults] = useState([]);
  useEffect(() => {
    axios
      .get('results')
      .then((res) => {
        setResults(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      {results.map((result: ReaultType, i: number) => {
        return <div key={i}>{`${result.topic}:${result.senryu}`}</div>;
      })}
    </>
  );
}
