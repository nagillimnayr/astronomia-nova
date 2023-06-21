import TimelineDate from './TimelineDate';
import TimelineTitle from './TimelineTitle';
import TimelineBody from './TimelineBody';

type TimelineItemProps = {
  date: Date;
  title: string;
  children: React.ReactNode;
};
const TimelineItem = (props: TimelineItemProps) => {
  return (
    <div className="relative mb-4 p-2">
      <TimelineDate date={props.date} />
      <TimelineTitle>{props.title}</TimelineTitle>
      <TimelineBody>{props.children}</TimelineBody>
    </div>
  );
};

export default TimelineItem;
