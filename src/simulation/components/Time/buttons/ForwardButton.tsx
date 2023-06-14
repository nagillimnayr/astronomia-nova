import { ForwardIcon } from '@heroicons/react/24/solid';
import {
  FastForward,
  FastForwardIcon,
  SkipForward,
  StepForward,
} from 'lucide-react';
import { useContext } from 'react';
import IconButton from '~/components/IconButton';
import { TimeContext } from '~/simulation/context/TimeContext';
const ForwardButton = () => {
  const { timescaleDisplayRef, timescaleRef } = useContext(TimeContext);

  const handleClick = () => {
    timescaleDisplayRef.current.textContent = Math.max(
      ++timescaleRef.current,
      0
    ).toString();
  };

  return (
    <IconButton onClick={handleClick}>
      <FastForwardIcon />
    </IconButton>
  );
};

export default ForwardButton;
