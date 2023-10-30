import { MachineContext } from '@/state/xstate/MachineProviders';
import { TimeUnit } from '@/state/xstate/time-machine/time-machine';
import { type TextMesh } from '@/type-declarations/troika-three-text/Text';
import { Text } from '@react-three/drei';
import { useCallback, useEffect, useRef } from 'react';
import { type Vector3Tuple } from 'three';

const FONT_SIZE = 0.8;

type VRTimescaleDisplayProps = {
  position?: Vector3Tuple;
};
export const VRTimescaleDisplay = ({
  position = [0, 0, 0],
}: VRTimescaleDisplayProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const textRef = useRef<TextMesh>(null!);

  const updateText = useRef<() => void>(null!);
  updateText.current = useCallback(() => {
    const textMesh = textRef.current;
    if (!textMesh) return;
    const { timescale, timescaleUnit } = timeActor.getSnapshot()!.context;
    const plural = Math.abs(timescale) === 1 ? '' : 's';
    const unitStr = TimeUnit[timescaleUnit]; // Reverse mapping to get name of enum.
    const text = `${timescale.toString()} ${unitStr}${plural} / Second`;
    textMesh.text = text;
  }, [timeActor]);

  // Subscribe to state changes in useEffect so that the component wont
  // rerender on state change, but we can update the view directly
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      updateText.current();
    });

    // Unsubscribe on dismount.
    return () => subscription.unsubscribe();
  }, [timeActor]);

  return (
    <>
      <group position={position}>
        <Text
          position-y={-0.05}
          ref={textRef}
          fontSize={FONT_SIZE}
          anchorX={'center'}
          anchorY={'middle'}
        >
          {'text'}
        </Text>
      </group>
    </>
  );
};
