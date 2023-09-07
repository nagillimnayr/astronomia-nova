import { Vector3Tuple } from 'three';
import { Text } from '@react-three/drei';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

type VRDebugPoseDisplayProps = {
  position?: Vector3Tuple;
};
export const VRDebugPoseDisplay = ({
  position = [0, 0, 0],
}: VRDebugPoseDisplayProps) => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const [pos, setPos] = useState<Vector3Tuple>([0, 0, 0]);

  useFrame(({ gl, camera }) => {
    const session = gl.xr.getSession();
    if (!session) return;

    const frame = gl.xr.getFrame();
    if (!frame) return;

    const refSpace = gl.xr.getReferenceSpace();
    if (!refSpace) return;
    const pose = frame.getViewerPose(refSpace);

    // const { pose } = vrActor.getSnapshot()!.context;

    if (!pose) return;
    const transform = pose.transform;
    // console.log(transform.position);
    const { x, y, z } = transform.position;
    setPos([x, y, z]);
  });

  const x = pos[0];
  const y = pos[1];
  const z = pos[2];

  return (
    <>
      <group position={position}>
        <Text position={[0, 1, 0]} anchorX={'center'} anchorY={'middle'}>
          {'x: ' + x.toFixed(3)}
        </Text>
        <Text position={[0, 0, 0]} anchorX={'center'} anchorY={'middle'}>
          {'y: ' + y.toFixed(3)}
        </Text>
        <Text position={[0, -1, 0]} anchorX={'center'} anchorY={'middle'}>
          {'z: ' + z.toFixed(3)}
        </Text>
      </group>
    </>
  );
};
