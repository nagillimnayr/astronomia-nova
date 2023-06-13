import {
  PlayIcon,
  PauseIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid';
import { Play, Pause, PlayCircle, PauseCircle } from 'lucide-react';
import IconButton from '~/components/IconButton';
const PauseButton = () => {
  return (
    <IconButton>
      <Play />
    </IconButton>
  );
};

export default PauseButton;
