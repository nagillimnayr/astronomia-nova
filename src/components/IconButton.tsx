import { MouseEventHandler } from 'react';

type IconBtnProps = {
  children: React.ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const IconButton = (props: IconBtnProps) => {
  return (
    <button
      className="flex aspect-square  w-10 items-center justify-center rounded-full border-2 border-white bg-transparent p-0 text-white"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default IconButton;
