type IconBtnProps = {
  children: React.ReactNode;
};

const IconButton = (props: IconBtnProps) => {
  return (
    <button className="aspect-square w-10  rounded-full border-2 border-white bg-transparent p-1 text-white">
      {props.children}
    </button>
  );
};

export default IconButton;
