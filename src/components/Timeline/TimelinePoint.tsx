type TimelinePointProps = {
  children?: React.ReactNode;
};
const TimelinePoint = (props: TimelinePointProps) => {
  return (
    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700" />
  );
};

export default TimelinePoint;
