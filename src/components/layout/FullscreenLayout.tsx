type FullscreenProps = {
  children: React.ReactNode;
};
export const FullscreenLayout = (props: FullscreenProps) => {
  return (
    <div className="m-0  flex min-h-screen w-full min-w-full flex-col items-center justify-start p-0">
      <main className="container flex min-h-fit w-full flex-col items-center justify-start   p-0">
        {/* Canvas */}

        <div
          id="canvas-holder"
          className="h-min-screen m-0 flex h-screen w-screen flex-col items-center justify-center p-0"
        >
          {props.children}
        </div>
      </main>
    </div>
  );
};
