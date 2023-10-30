import { MachineContext } from '@/state/xstate/MachineProviders';
import { toggleSession, VRButton } from '@react-three/xr';
import { useSelector } from '@xstate/react';
import { useCallback, useRef } from 'react';

export const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

export const sessionOptions: XRSessionInit = {
  requiredFeatures: [REF_SPACE_TYPE],
  optionalFeatures: ['hand-tracking'],
};

export const EnterVRButton = () => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // const buttonRef = useRef<HTMLButtonElement>(null!);
  // const toggleVR = useCallback(async () => {
  //   console.log('toggleVR clicked');
  //   const session = await toggleSession('immersive-vr', {
  //     sessionInit: sessionOptions,
  //   });
  // }, []);

  const vrActive = useSelector(vrActor, (state) => state.matches('active'));

  const text = vrActive ? 'Exit VR' : 'Enter VR';
  return (
    <>
      {/* <button
        ref={buttonRef}
        className="min-w-fit select-none rounded-lg border-2 border-white p-2 transition-all hover:bg-subtle hover:bg-opacity-20"
        onClick={toggleVR}
      >
        {text}
      </button> */}
      <VRButton
        sessionInit={sessionOptions}
        style={{
          userSelect: 'none',
          borderRadius: '12px',
          width: '124px',
          maxWidth: '124px',
        }}
        className={
          'select-none border-2 border-white  p-2 transition-all hover:bg-subtle hover:bg-opacity-20'
        }
      >
        {(status) => (status === 'unsupported' ? `WebXR ${status}` : text)}
      </VRButton>
    </>
  );
};
