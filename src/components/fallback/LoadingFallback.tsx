import './fallback.css';

export const LoadingFallback = () => {
  return (
    <div className="grid h-full w-full place-items-center text-foreground">
      {/* <span className="icon-[svg-spinners--ring-resize] aspect-square text-5xl" />
      <span className="icon-[svg-spinners--ring-resize] aspect-square text-5xl" /> */}
      <div className="loader">
        Loading
        <span></span>
      </div>
    </div>
  );
};
