type TimelineTitleProps = {
  children: React.ReactNode;
};

const TimelineTitle = (props: TimelineTitleProps) => {
  return (
    <h3 className="ml-4 text-lg font-semibold text-gray-200 dark:text-white">
      {props.children}
    </h3>
  );
};

export default TimelineTitle;
