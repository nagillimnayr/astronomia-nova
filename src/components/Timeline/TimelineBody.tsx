type TimelineBodyProps = {
  children: React.ReactNode;
};
const TimelineBody = (props: TimelineBodyProps) => {
  return (
    <div className="ml-4 text-base font-normal text-gray-400">
      {props.children}
    </div>
  );
};

export default TimelineBody;
