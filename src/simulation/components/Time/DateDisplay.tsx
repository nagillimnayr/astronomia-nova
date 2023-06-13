import { useRef, useState } from 'react';
import { format, addDays } from 'date-fns';
import { useFrame } from '@react-three/fiber';
const DateDisplay = () => {
  const [date, setDate] = useState<Date>(new Date(2000, 0, 1, 12, 0, 0, 0));
  const hourRef = useRef<HTMLParagraphElement>(null!);
  const dateRef = useRef<HTMLParagraphElement>(null!);
  useFrame(({ clock }) => {
    if (clock.running) {
      const daysElapsed = clock.elapsedTime;
      const currentDate = addDays(date, daysElapsed);

      hourRef.current.textContent = format(currentDate, 'p');
      dateRef.current.textContent = format(currentDate, 'PPP');
    }
  });
  return (
    <div>
      <p ref={hourRef}></p>
      <p ref={dateRef}></p>
    </div>
  );
};

export default DateDisplay;
