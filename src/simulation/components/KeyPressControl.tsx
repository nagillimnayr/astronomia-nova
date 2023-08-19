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

  useEventListener('keydown', (event) => {
    switch (
      event.key
      // case ' ': {
      // const { camera, controls, scene } = getThree();
      // console.log('camera:', camera);
      // console.log('camera parent:', camera.parent);
      // }
      // case 'ArrowLeft': {
      //   rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
      //   break;
      // }
      // case 'ArrowRight': {
      //   rootActor.send({ type: 'ADVANCE_DAY' });
      //   break;
      // }
    ) {
    }
  });

  return (
    <>
      <></>
    </>
  );
};
