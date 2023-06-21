import { format } from 'date-fns';
import TimelinePoint from './TimelinePoint';

type TimelineDateProps = {
  date: Date;
};
const TimelineDate = (props: TimelineDateProps) => {
  return (
    <div>
      <TimelinePoint />
      <time className="text-md mb-1 ml-4 font-normal leading-none text-gray-400 dark:text-gray-500">
        {format(props.date, 'PPP')}
      </time>
    </div>
  );
};

export default TimelineDate;
