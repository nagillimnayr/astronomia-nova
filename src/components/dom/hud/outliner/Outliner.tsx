import { LoadingFallback } from '@/components/dom/fallback/LoadingFallback';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { OutlinerItem } from './OutlinerItem';

const Outliner = () => {
  const { keplerTreeActor, mapActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const root = useSelector(keplerTreeActor, ({ context }) => context.root);
  // Bind to state changes so that the component will re-render whenever
  // bodyMap is modified.
  useSelector(mapActor, ({ context }) => context.bodyMap);

  if (!root) {
    return <LoadingFallback />;
  }
  return (
    <div className="pointer-events-auto flex h-full min-h-fit w-full min-w-fit flex-col items-start justify-start gap-0 rounded-lg p-4 text-xl">
      <OutlinerItem body={root} defaultOpen />
    </div>
  );
};

export default Outliner;
