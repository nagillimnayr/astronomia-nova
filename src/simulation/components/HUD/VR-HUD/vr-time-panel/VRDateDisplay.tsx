import { MachineContext } from '@/state/xstate/MachineProviders';
import { Text } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { Suspense } from 'react';
import { type Vector3Tuple } from 'three';
import { text } from '../vr-hud-constants';

type VRDateDisplayProps = {
  position?: Vector3Tuple;
};
export const VRDateDisplay = ({ position = [0, 0, 0] }: VRDateDisplayProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  // Subscribe to state changes so that the component will re-render whenever the date changes.
  const date = useSelector(timeActor, ({ context }) => context.date);

  // Format the date.
  const hoursStr = format(date, 'hh:mm:ss a');
  const dateStr = format(date, 'PPP');

  const fontSize = 1;
  return (
    <>
      <group position={position}>
        <Suspense>
          <Text
            fontSize={fontSize}
            position={[0, 0.5 * fontSize, 0]}
            anchorX={'center'}
            anchorY={'middle'}
          >
            {hoursStr}
          </Text>

          <Text
            fontSize={fontSize}
            position={[0, -0.5 * fontSize, 0]}
            anchorX={'center'}
            anchorY={'middle'}
          >
            {dateStr}
          </Text>
        </Suspense>
      </group>
    </>
  );
};
