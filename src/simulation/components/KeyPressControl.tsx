import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEventListener, useKeyPressed } from '@react-hooks-library/core';
import { CameraControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();
const _diff = new Vector3();

export const KeyPressControl = () => {
  const getThree = useThree(({ get }) => get);
  const rootActor = MachineContext.useActorRef();
  const { mapActor } = MachineContext.useSelector(({ context }) => context);

  useKeyPressed(' ', (evt) => {
    evt.preventDefault();
    const { camera, controls, scene } = getThree();
    console.log('camera:', camera);
    console.log('camera parent:', camera.parent);
  });

  useKeyPressed('ArrowLeft', (event) => {
    console.log(event);
    // rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
  });

  useKeyPressed('ArrowRight', (event) => {
    console.log(event);
    // rootActor.send({ type: 'ADVANCE_DAY' });
  });

  useEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowLeft': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        break;
      }
      case 'ArrowRight': {
        rootActor.send({ type: 'ADVANCE_DAY' });
        break;
      }
    }
  });

  return (
    <>
      <></>
    </>
  );
};
