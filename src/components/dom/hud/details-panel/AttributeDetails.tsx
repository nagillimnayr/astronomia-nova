type Props = {
  name: string;
  children: string;
};
export const AttributeDetails = ({ name, children }: Props) => {
  return (
    <>
      <div className="m-0 flex h-fit w-full flex-col items-start justify-start overflow-hidden whitespace-nowrap rounded-md bg-zinc-800/80 px-2 py-1">
        <span className="text-xs ">{name}:</span>
        <span className="w-full text-right text-xs">{children}</span>
      </div>
    </>
  );
};
