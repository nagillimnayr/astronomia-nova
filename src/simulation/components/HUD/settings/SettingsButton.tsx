import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { useCallback } from 'react';

type Props = {
  handleClick: () => void;
};
export const SettingsButton = () => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const settingsMenuActor = useSelector(
    uiActor,
    ({ context }) => context.settingsMenuActor
  );

  const handleClick = useCallback(() => {
    settingsMenuActor.send({ type: 'TOGGLE' });
  }, [settingsMenuActor]);
  return (
    <>
      <button
        className="m-0 inline-flex items-center justify-center rounded-full bg-clip-text p-0"
        onClick={handleClick}
      >
        <span className="icon-[mdi--cog] text-4xl text-gray-200/30 transition-colors  hover:text-gray-200/50" />
      </button>
    </>
  );
};
