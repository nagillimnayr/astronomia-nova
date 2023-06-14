import { BackwardIcon } from '@heroicons/react/24/solid';
import { Rewind } from 'lucide-react';
import { useContext } from 'react';
import IconButton from '~/components/IconButton';
import { TimeContext } from '~/simulation/context/TimeContext';

const BackwardButton = () => {
  const { timescaleDisplayRef, timescaleRef } = useContext(TimeContext);

  const handleClick = () => {
    timescaleDisplayRef.current.textContent = Math.max(
      --timescaleRef.current,
      0
    ).toString();
  };
  return (
    <IconButton onClick={handleClick}>
      <Rewind />
    </IconButton>
  );
};

export default BackwardButton;
