import { useState, useEffect } from 'react';

export default function TimerComponent( {startTime, setStartTime, elapsedTime, setElapsedTime }: {startTime: number | null, setStartTime: Function, elapsedTime: number | null, setElapsedTime: Function}) {
//   const [startTime, setStartTime] = useState<number | null>(null);
//   const [elapsedTime, setElapsedTime] = useState(0);

  const startTimer = () => {
    setStartTime(Date.now());
  };

  useEffect(() => {
    let interval: any;

    if (startTime !== null) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    // Cleanup interval on component unmount or when the timer stops
    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return (
    <div>
      <p className="mt-4">Elapsed Time: {elapsedTime} seconds</p>
    </div>
  );
}