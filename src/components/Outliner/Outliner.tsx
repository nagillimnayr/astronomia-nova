import { OutlinerItem } from './OutlinerItem';

import { LoadingFallback } from '../LoadingFallback';
import { useSimStore } from '@/simulation/state/zustand/sim-store';
import { observer } from 'mobx-react-lite';

const Outliner = observer(() => {
  const rootRef = useSimStore((state) => state.rootRef);

  if (!rootRef || !rootRef.current) {
    return <LoadingFallback />;
  }
  return (
    <div className="flex h-full min-h-fit w-full min-w-fit flex-col items-start justify-start gap-0 border p-0 text-xl">
      <OutlinerItem body={rootRef.current} />
    </div>
  );
});

export default Outliner;
