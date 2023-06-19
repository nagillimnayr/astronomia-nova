export const LoadingFallback = () => {
  return (
    <div className="flex w-full flex-row items-center justify-center">
      <span className="loading loading-spinner loading-lg" />
      <h2 className="mx-2 place-self-center text-3xl text-white">Loading...</h2>
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
};
