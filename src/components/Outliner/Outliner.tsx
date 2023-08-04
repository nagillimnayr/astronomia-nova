import { OutlinerItem } from './OutlinerItem';

import { LoadingFallback } from '../LoadingFallback';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import {
  MachineContext,
  // RootActorContext,
} from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

const Outliner = observer(() => {
  const { keplerTreeActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const root = useSelector(keplerTreeActor, ({ context }) => context.root);

  if (!root) {
    return <LoadingFallback />;
  }
  return (
    <div className="flex h-full min-h-fit w-full min-w-fit flex-col items-start justify-start gap-0 border p-0 text-xl">
      <OutlinerItem body={root} />
    </div>
  );
});

export default Outliner;
