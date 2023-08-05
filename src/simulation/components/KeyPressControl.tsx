import { MachineContext } from '@/state/xstate/MachineProviders';
import { useKeyPressed } from '@react-hooks-library/core';
import { CameraControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();
const _diff = new Vector3();

export const KeyPressControl = () => {
  const getThree = useThree(({ get }) => get);
  const { mapActor } = MachineContext.useSelector(({ context }) => context);

  useKeyPressed(' ', (evt) => {
    evt.preventDefault();
    const { camera, controls } = getThree();

    // const camControls = controls as unknown as CameraControls;
    // const distanceToCamera = camControls.distance;
    const { bodyMap } = mapActor.getSnapshot()!.context;
    const body = bodyMap.get('Moon')!;
    const distanceToParent = body.position.length();

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);

    _diff.subVectors(_bodyWorldPos, _camWorldPos);
    const distanceToCamera = _diff.length();
    console.log('distance to camera:', distanceToCamera);

    console.log('distance to parent:', body.position.length());
    console.log('ratio parent/camera:', distanceToParent / distanceToCamera);
  });
  return (
    <>
      <></>
    </>
  );
};
