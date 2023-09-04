import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { toggleSession } from '@react-three/xr';
import { useCallback, useRef } from 'react';

export const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

export const sessionOptions: XRSessionInit = {
  requiredFeatures: [REF_SPACE_TYPE, 'hand-tracking'],
};

export const EnterVRButton = () => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const buttonRef = useRef<HTMLButtonElement>(null!);
  const toggleVR = useCallback(async () => {
    console.log('toggleVR clicked');
    const session = await toggleSession('immersive-vr', {
      sessionInit: sessionOptions,
    });
  }, []);

  const vrActive = useSelector(vrActor, (state) => state.matches('active'));

  return (
    <>
      <button
        ref={buttonRef}
        className="select-none rounded-lg border-2 border-white p-2 transition-all hover:bg-subtle hover:bg-opacity-20"
        onClick={toggleVR}
      >
        {vrActive ? 'Exit VR' : 'Enter VR'}
      </button>
    </>
  );
};
