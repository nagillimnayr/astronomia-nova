import * as Accordion from '@radix-ui/react-accordion';
import OutlinerItem from './OutlinerItem';
import KeplerBody from '@/simulation/classes/KeplerBody';

import { LoadingFallback } from '../LoadingFallback';
import { useSimStore } from '@/simulation/state/zustand/sim-store';

const Outliner = () => {
  const rootRef = useSimStore((state) => state.rootRef);

  if (!rootRef || !rootRef.current) {
    return <LoadingFallback />;
  }
  return (
    <section className="h-fit min-h-fit w-fit min-w-fit border p-0">
      <OutlinerItem body={rootRef.current} />
    </section>
  );
};

export default Outliner;
