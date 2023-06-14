import { BackwardIcon } from '@heroicons/react/24/solid';
import { Rewind } from 'lucide-react';
import { useContext } from 'react';
import IconButton from '~/components/IconButton';
import { TimeContext } from '~/simulation/context/TimeContext';

const BackwardButton = () => {
  const { timescaleDisplayRef, timescaleRef } = useContext(TimeContext);

  const handleClick = () => {
    timescaleRef.current = Math.max(timescaleRef.current - 1, 0);
    timescaleDisplayRef.current.textContent = timescaleRef.current.toString();
  };
  return (
    <IconButton onClick={handleClick}>
      <Rewind />
    </IconButton>
  );
};

export default BackwardButton;
