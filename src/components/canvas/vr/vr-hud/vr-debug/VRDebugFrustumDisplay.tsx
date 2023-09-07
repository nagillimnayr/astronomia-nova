import { Vector3Tuple } from 'three';
import { Text } from '@react-three/drei';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

type VRDebugFrustumDisplayProps = {
  position?: Vector3Tuple;
};
export const VRDebugFrustumDisplay = ({
  position = [0, 0, 0],
}: VRDebugFrustumDisplayProps) => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const [near, setNear] = useState<number>(0);
  const [far, setFar] = useState<number>(0);

  // const session = useXR(({session})=>session)

  useFrame(({ gl, camera }) => {
    const session = gl.xr.getSession();
    if (!session) return;

    const { depthNear, depthFar } = session.renderState;
    setNear(depthNear);
    setFar(depthFar);
  });

  return (
    <>
      <group position={position}>
        <Text position={[0, 0.5, 0]} anchorX={'center'} anchorY={'middle'}>
          {'near: ' + near.toString()}
        </Text>
        <Text position={[0, -0.5, 0]} anchorX={'center'} anchorY={'middle'}>
          {'far: ' + far.toFixed(2)}
        </Text>
      </group>
    </>
  );
};
