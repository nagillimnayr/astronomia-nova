import { ForwardIcon } from '@heroicons/react/24/solid';
import {
  FastForward,
  FastForwardIcon,
  SkipForward,
  StepForward,
} from 'lucide-react';
import { useContext } from 'react';
import IconButton from '~/components/IconButton';
import { timeState } from '~/simulation/state/TimeState';
const ForwardButton = () => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        timeState.incrementTimescale();
      }}
    >
      <FastForwardIcon />
    </IconButton>
  );
};

export default ForwardButton;
