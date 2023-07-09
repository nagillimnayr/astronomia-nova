import { BackwardIcon } from '@heroicons/react/24/solid';
import { Rewind } from 'lucide-react';
import IconButton from '~/components/IconButton';
import { timeState } from '~/simulation/state/TimeState';

const BackwardButton = () => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        timeState.decrementTimescale();
      }}
    >
      <Rewind />
    </IconButton>
  );
};

export default BackwardButton;
