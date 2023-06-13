type IconBtnProps = {
  children: React.ReactNode;
};

const IconButton = (props: IconBtnProps) => {
  return (
    <button className="flex aspect-square  w-10 items-center justify-center rounded-full border-2 border-white bg-transparent p-0 text-white">
      {props.children}
    </button>
  );
};

export default IconButton;
