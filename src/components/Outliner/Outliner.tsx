import * as Accordion from '@radix-ui/react-accordion';
import OutlinerItem from './OutlinerItem';
import KeplerBody from '@/simulation/classes/KeplerBody';
import { useSnapshot } from 'valtio';

import { LoadingFallback } from '../LoadingFallback';
import { useSimStore } from '@/simulation/state/zustand/sim-store';

const Outliner = () => {
  const root = useSimStore((state) => state.root);

  if (!root) {
    return <LoadingFallback />;
  }
  return <OutlinerItem body={root} />;
};

export default Outliner;
