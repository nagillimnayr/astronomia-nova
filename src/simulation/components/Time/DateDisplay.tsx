import { useContext, useRef, useState } from 'react';
import { format, addDays } from 'date-fns';
import { useFrame } from '@react-three/fiber';
import { TimeContext } from '~/simulation/context/TimeContext';
const DateDisplay = () => {
  const time = useContext(TimeContext);

  return (
    <div className="text-white">
      <p ref={time.hourRef}></p>
      <p ref={time.dateRef}></p>
    </div>
  );
};

export default DateDisplay;
