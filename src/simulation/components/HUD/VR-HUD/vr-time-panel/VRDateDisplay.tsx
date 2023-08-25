import { MachineContext } from '@/state/xstate/MachineProviders';
import { Text } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { Suspense, useEffect, useRef } from 'react';
import { Object3D, type Vector3Tuple } from 'three';
import { text } from '../vr-hud-constants';
// import { Text as TextMesh } from 'troika-three-text';
import { J2000 } from '@/simulation/utils/constants';

const FONT_SIZE = 1;

type VRDateDisplayProps = {
  position?: Vector3Tuple;
};
export const VRDateDisplay = ({ position = [0, 0, 0] }: VRDateDisplayProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  // Subscribe to state changes so that the component will re-render whenever the date changes.
  // const date = useSelector(timeActor, ({ context }) => context.date);

  const { refDate } = timeActor.getSnapshot()!.context;

  const hoursRef = useRef<unknown>(null!);
  const dateRef = useRef<unknown>(null!);

  useEffect(() => {
    // Subscribe to state changes so as to avoid re-renders.
    const subscription = timeActor.subscribe((state) => {
      // console.log('update date display');
      const isPaused = state.matches('paused');
      if (isPaused && state.event.type !== 'ADVANCE_TIME') {
        return;
      }
      const hoursMesh = hoursRef.current;
      const dateMesh = dateRef.current;
      if (!hoursMesh || !dateMesh) return;

      // Narrow the types.
      if (typeof hoursMesh !== 'object' || typeof dateMesh !== 'object') return;
      if (!('text' in hoursMesh) || !('text' in dateMesh)) return;
      if (!('sync' in hoursMesh) || !('sync' in dateMesh)) return;
      if (typeof hoursMesh.text !== 'string') return;
      if (typeof dateMesh.text !== 'string') return;
      if (typeof hoursMesh.sync !== 'function') return;
      if (typeof dateMesh.sync !== 'function') return;

      const { date } = state.context;
      hoursMesh.text = format(date, 'hh:mm:ss a');
      dateMesh.text = format(date, 'PPP');
      hoursMesh.sync();
      dateMesh.sync();
    });

    return () => subscription.unsubscribe();
  }, [timeActor]);

  // Format the date.
  const hoursStr = format(refDate, 'hh:mm:ss a');
  const dateStr = format(refDate, 'PPP');
  console.log('hoursStr:', hoursStr);
  console.log('dateStr:', dateStr);

  const fontSize = 1;
  console.log('dateDisplay render');
  return (
    <>
      <group position={position}>
        <Suspense>
          <Text
            ref={hoursRef}
            fontSize={fontSize}
            position={[0, 0.5 * fontSize, 0]}
            anchorX={'center'}
            anchorY={'middle'}
            onSync={(troika) => {
              console.log('hoursMesh:', troika);
            }}
          >
            {hoursStr}
          </Text>

          <Text
            ref={dateRef}
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

const HoursText = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const hoursRef = useRef<unknown>(null!);

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

      // Narrow the type.
      if (typeof hoursMesh !== 'object') return;
      if (!('text' in hoursMesh)) return;
      if (!('sync' in hoursMesh)) return;
      if (typeof hoursMesh.text !== 'string') return;
      if (typeof hoursMesh.sync !== 'function') return;

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
          position={[0, 0.5 * FONT_SIZE, 0]}
          anchorX={'center'}
          anchorY={'middle'}
          onSync={(troika) => {
            console.log('hoursMesh:', troika);
          }}
        >
          {hoursStr}
        </Text>
      </Suspense>
    </>
  );
};

const DateText = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const dateRef = useRef<unknown>(null!);

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

      // Narrow the type.
      if (typeof dateMesh !== 'object') return;
      if (!('text' in dateMesh)) return;
      if (!('sync' in dateMesh)) return;
      if (typeof dateMesh.text !== 'string') return;
      if (typeof dateMesh.sync !== 'function') return;

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
          position={[0, 0.5 * FONT_SIZE, 0]}
          anchorX={'center'}
          anchorY={'middle'}
          onSync={(troika) => {
            console.log('dateMesh:', troika);
          }}
        >
          {dateStr}
        </Text>
      </Suspense>
    </>
  );
};
