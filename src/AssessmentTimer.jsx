import { useEffect, useRef, useState } from "react";
import { SWATheam } from "../constant";


export default function AssessmentTimer({ totalTime, unattemptedQuesCount, onTimeOver }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!totalTime || timeLeft !== null) return;

    const [h = 0, m = 0, s = 0] =
      totalTime.split(":").map(n => Number(n) || 0);

    setTimeLeft(h * 3600 + m * 60 + s);
  }, [totalTime, timeLeft]);


  useEffect(() => {
    if (timeLeft === null || timerRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          // onTimeOver?.();   
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [timeLeft, onTimeOver]);

  const formatTime = (sec = 0) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (timeLeft === null) return null;

  return (
    <div className="timerBox">
      {`Time Left: ${timeLeft !== 0 ? formatTime(timeLeft) : "EXPIRED"}`}
    </div>
  );
}
