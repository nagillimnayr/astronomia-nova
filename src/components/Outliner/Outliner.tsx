import { OutlinerItem } from './OutlinerItem';

import { LoadingFallback } from '../LoadingFallback';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import {
  GlobalStateContext,
  // RootActorContext,
} from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

const Outliner = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const rootActor = rootStore.rootMachine;
  // const rootActor = RootActorContext.useActorRef();
  const keplerTreeActor = useSelector(
    rootActor,
    ({ context }) => context.keplerTreeActor
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
