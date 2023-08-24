import { MachineContext } from '@/state/xstate/MachineProviders';
import { useThree } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useEffect } from 'react';

export const VRInputListener = () => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const inSession = useSelector(vrActor, (state) => state.matches('active'));

  const getThree = useThree(({ get }) => get);

  useEffect(() => {
    if (!inSession) return;
    const { xr } = getThree().gl;
    const session = xr.getSession();
    if (!session) return;

    function handleInputEvent(inputEvent: XRInputSourceEvent) {
      vrActor.send({ type: 'ASSIGN_INPUT_EVENT', inputEvent });
      console.log(inputEvent);
    }

    session.addEventListener('select', handleInputEvent);
    session.addEventListener('squeeze', handleInputEvent);

    return () => {
      if (session) {
        session.removeEventListener('select', handleInputEvent);
        session.removeEventListener('squeeze', handleInputEvent);
      }
    };
  }, [getThree, inSession, vrActor]);

  return (
    <>
      <></>
    </>
  );
};
