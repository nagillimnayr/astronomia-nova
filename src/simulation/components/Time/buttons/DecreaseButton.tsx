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

const DecreaseButton = () => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        timeState.decrementTimescale();
      }}
    >
      <TriangleLeftIcon />
    </IconButton>
  );
};

export default DecreaseButton;
