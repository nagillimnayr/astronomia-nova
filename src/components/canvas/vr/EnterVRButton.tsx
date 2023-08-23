import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEnterXR, useXR } from '@coconut-xr/natuerlich/react';
import { useSelector } from '@xstate/react';

export const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

export const sessionOptions: XRSessionInit = {
  requiredFeatures: [REF_SPACE_TYPE],
};

export const EnterVRButton = () => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const enterVR = useEnterXR('immersive-vr', sessionOptions);

  const vrActive = useSelector(vrActor, (state) => state.matches('active'));

  return (
    <>
      <button
        className="select-none rounded-lg border-2 border-white p-2 transition-all hover:bg-subtle hover:bg-opacity-20"
        onClick={() => {
          if (vrActive) {
            // End the session.
            const { session } = useXR.getState();
            if (!session) return;
            session
              .end()
              .then(() => {
                vrActor.send({ type: 'END_SESSION' });
                cameraActor.send({
                  type: 'END_XR_SESSION',
                });
              })
              .catch((reason) => console.error(reason));
          } else {
            // Start session.
            enterVR()
              .then(() => {
                vrActor.send({ type: 'START_SESSION' });
                cameraActor.send({
                  type: 'START_XR_SESSION',
                });
              })
              .catch((reason) => console.error(reason));
          }
        }}
      >
        {vrActive ? 'Exit VR!' : 'Enter VR!'}
      </button>
    </>
  );
};
