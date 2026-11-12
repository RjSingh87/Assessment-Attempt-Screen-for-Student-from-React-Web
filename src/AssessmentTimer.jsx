import { useEffect, useRef, useState } from "react";
import { SWATheam } from "../constant";

const parseTotalSeconds = (time) => {
  if (!time) return 3600; // default 60 minutes if not provided
  if (typeof time === "number") {
    return time <= 180 ? time * 60 : time;
  }
  if (typeof time === "string") {
    if (time.includes(":")) {
      const parts = time.split(":").map(n => Number(n) || 0);
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (parts.length === 2) return parts[0] * 60 + parts[1];
    }
    const n = Number(time);
    if (!isNaN(n) && n > 0) {
      return n <= 180 ? n * 60 : n;
    }
  }
  return 3600;
};

export default function AssessmentTimer({ totalTime, unattemptedQuesCount, onTimeOver, renderCustom }) {
  const [timeLeft, setTimeLeft] = useState(() => parseTotalSeconds(totalTime));
  const timerRef = useRef(null);

  useEffect(() => {
    if (totalTime) {
      const sec = parseTotalSeconds(totalTime);
      setTimeLeft(sec);
    }
  }, [totalTime]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          onTimeOver?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [onTimeOver]);

  const formatTime = (sec = 0) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const displayTime = timeLeft !== null ? (timeLeft !== 0 ? formatTime(timeLeft) : "EXPIRED") : "00:00:00";

  if (renderCustom) {
    return renderCustom(displayTime, timeLeft);
  }

  return (
    <div className="timerBox">
      {`Time Left: ${displayTime}`}
    </div>
  );
}
