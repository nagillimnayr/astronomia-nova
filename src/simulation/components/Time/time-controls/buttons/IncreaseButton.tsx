import {
  TriangleRightIcon,
  CaretRightIcon,
  ChevronRightIcon,
  DoubleArrowRightIcon,
  ThickArrowRightIcon,
} from '@radix-ui/react-icons';
import IconButton from '@/components/IconButton';
import { timeState } from '@/simulation/state/TimeState';
import Icon from '@mdi/react';
import { mdiMenuRight } from '@mdi/js';

const IncreaseButton = () => {
  return (
    <button
      className="btn-icon -translate-x-1 "
      onClick={(e) => {
        e.stopPropagation();
        timeState.incrementTimescale();
      }}
    >
      <Icon path={mdiMenuRight} size={1} />
    </button>
  );
};

export default IncreaseButton;
