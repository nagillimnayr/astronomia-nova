import {
  TriangleRightIcon,
  CaretRightIcon,
  ChevronRightIcon,
  DoubleArrowRightIcon,
  ThickArrowRightIcon,
} from '@radix-ui/react-icons';
import IconButton from '~/components/IconButton';
import { timeState } from '~/simulation/state/TimeState';

const IncreaseButton = () => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        timeState.incrementTimescale();
      }}
    >
      <TriangleRightIcon />
    </IconButton>
  );
};

export default IncreaseButton;
