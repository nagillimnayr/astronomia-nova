import { OutlinerItem } from './OutlinerItem';

import { LoadingFallback } from '../../../../components/LoadingFallback';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import {
  MachineContext,
  // RootActorContext,
} from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

const Outliner = observer(() => {
  const { keplerTreeActor, mapActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const root = useSelector(keplerTreeActor, ({ context }) => context.root);
  // Bind to state changes so that the component will re-render whenever bodyMap is modified.
  useSelector(mapActor, ({ context }) => context.bodyMap);

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
