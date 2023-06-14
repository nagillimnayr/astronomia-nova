import { useContext } from 'react';
import { TimeContext } from '~/simulation/context/TimeContext';

const TimescaleDisplay = () => {
  const { timescaleDisplayRef, timescaleRef } = useContext(TimeContext);

  const timescale = timescaleRef.current;

  return (
    <span className="w-min-fit flex flex-row justify-center whitespace-nowrap text-white">
      <span ref={timescaleDisplayRef}>{timescale}</span>&nbsp;Days / second
    </span>
  );
};

export default TimescaleDisplay;
