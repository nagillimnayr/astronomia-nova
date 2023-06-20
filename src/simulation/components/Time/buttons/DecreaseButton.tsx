import {
  TriangleLeftIcon,
  TriangleRightIcon,
  CaretLeftIcon,
  ChevronLeftIcon,
  DoubleArrowLeftIcon,
  ThickArrowLeftIcon,
} from '@radix-ui/react-icons';
import IconButton from '~/components/IconButton';
import { timeState } from '~/simulation/state/TimeState';
import Icon from '@mdi/react';
import { mdiMenuLeft } from '@mdi/js';

const DecreaseButton = () => {
  return (
    <button
      className="btn-icon translate-x-1"
      onClick={(e) => {
        e.stopPropagation();
        timeState.decrementTimescale();
      }}
    >
      <Icon path={mdiMenuLeft} size={1} />
    </button>
  );
};

export default DecreaseButton;
