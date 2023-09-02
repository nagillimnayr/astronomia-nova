import { MachineContext } from '@/state/xstate/MachineProviders';
import { Text } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { Suspense, useEffect, useRef } from 'react';
import { Object3D, type Vector3Tuple } from 'three';
// import { Text as TextMesh } from 'troika-three-text';
// import { type Text as TextMesh } from 'troika-three-text/src/Text';
import { type Text as TextMesh } from '@/type-declarations/troika-three-text/Text';
import { J2000 } from '@/simulation/utils/constants';

const FONT_SIZE = 1;

type VRDateDisplayProps = {
  position?: Vector3Tuple;
};
export const VRDateDisplay = ({ position = [0, 0, 0] }: VRDateDisplayProps) => {
  // const { timeActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <>
      <group position={position}>
        <HoursText position={[0, 0.5 * FONT_SIZE, 0]} />

        <DateText position={[0, -0.5 * FONT_SIZE, 0]} />
      </group>
    </>
  );
};

type TextMeshProps = {
  position?: Vector3Tuple;
};
const HoursText = ({ position }: TextMeshProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const hoursRef = useRef<TextMesh>(null!);

  useEffect(() => {
    // Subscribe to state changes so as to avoid re-renders.
    const subscription = timeActor.subscribe((state) => {
      // console.log('update date display');
      const isPaused = state.matches('paused');
      if (isPaused && state.event.type !== 'ADVANCE_TIME') {
        return;
      }
      const hoursMesh = hoursRef.current;
      if (!hoursMesh) return;
      const { date } = state.context;
      hoursMesh.text = format(date, 'hh:mm:ss a');
      hoursMesh.sync();
    });

    return () => subscription.unsubscribe();
  }, [timeActor]);

  const hoursStr = format(J2000, 'hh:mm:ss a');
  return (
    <>
      <Suspense>
        <Text
          ref={hoursRef}
          fontSize={FONT_SIZE}
          position={position}
          anchorX={'center'}
          anchorY={'middle'}
        >
          {hoursStr}
        </Text>
      </Suspense>
    </>
  );
};

const DateText = ({ position }: TextMeshProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const dateRef = useRef<TextMesh>(null!);

  useEffect(() => {
    // Subscribe to state changes so as to avoid re-renders.
    const subscription = timeActor.subscribe((state) => {
      // console.log('update date display');
      const isPaused = state.matches('paused');
      if (isPaused && state.event.type !== 'ADVANCE_TIME') {
        return;
      }
      const dateMesh = dateRef.current;
      if (!dateMesh) return;

      const { date } = state.context;
      dateMesh.text = format(date, 'PPP');
      dateMesh.sync();
    });

    return () => subscription.unsubscribe();
  }, [timeActor]);
  const dateStr = format(J2000, 'PPP');
  return (
    <>
      <Suspense>
        <Text
          ref={dateRef}
          fontSize={FONT_SIZE}
          position={position}
          anchorX={'center'}
          anchorY={'middle'}
        >
          {dateStr}
        </Text>
      </Suspense>
    </>
  );
};
