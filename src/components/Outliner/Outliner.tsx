import * as Accordion from '@radix-ui/react-accordion';
import OutlinerItem from './OutlinerItem';
import KeplerBody from '@/simulation/classes/KeplerBody';
import { useSnapshot } from 'valtio';
import { keplerTreeState } from '@/simulation/state/keplerTreeState';
import { LoadingFallback } from '../LoadingFallback';

const Outliner = () => {
  const snap = useSnapshot(keplerTreeState);

  if (!snap.root) {
    return <LoadingFallback />;
  }
  return <OutlinerItem body={keplerTreeState.root} />;
};

export default Outliner;
