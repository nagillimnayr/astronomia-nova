import { MachineContext } from '@/state/xstate/MachineProviders';
import { SettingsMenu } from '../SettingsMenu';
import { useSelector } from '@xstate/react';
import { useEffect } from 'react';

export const SettingsMenuStory = () => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const settingsMenuActor = useSelector(
    uiActor,
    ({ context }) => context.settingsMenuActor
  );
  useEffect(() => {
    settingsMenuActor.send({ type: 'OPEN' });
  }, [settingsMenuActor]);
  return (
    <>
      <SettingsMenu />
    </>
  );
};
