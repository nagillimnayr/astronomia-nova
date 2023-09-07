import { Vector3Tuple } from 'three';
import { Text } from '@react-three/drei';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

type VRDebugDisplayProps = {
  position?: Vector3Tuple;
};
export const VRDebugEventDisplay = ({
  position = [0, 0, 0],
}: VRDebugDisplayProps) => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const lastInputEvent = useSelector(
    vrActor,
    ({ context }) => context.lastInputEvent
  );
  const eventType = lastInputEvent?.type?.toString();
  const hand = lastInputEvent?.inputSource?.handedness;
  return (
    <>
      <group position={position}>
        <Text position={[0, 0.5, 0]} anchorX={'center'} anchorY={'middle'}>
          {'last input event: '}
        </Text>
        <Text position={[0, -0.5, 0]} anchorX={'center'} anchorY={'middle'}>
          {`${eventType ?? 'null'}` + ' ' + `${hand ?? 'null'}`}
        </Text>
      </group>
    </>
  );
};
