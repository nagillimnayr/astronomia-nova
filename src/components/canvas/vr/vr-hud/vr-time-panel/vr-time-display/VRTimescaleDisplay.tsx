import { MachineContext } from '@/state/xstate/MachineProviders';
import { TimeUnit } from '@/state/xstate/time-machine/time-machine';
import { type TextMesh } from '@/type-declarations/troika-three-text/Text';
import { Text } from '@react-three/drei';
import { useCallback, useEffect, useRef } from 'react';
import { type Vector3Tuple } from 'three';
import { VRIconButton } from '../../vr-ui-components/VRIconButton';

type VRTimescaleDisplayProps = {
  position?: Vector3Tuple;
};
export const VRTimescaleDisplay = ({
  position = [0, 0, 0],
}: VRTimescaleDisplayProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescale = timeActor.getSnapshot()!.context.timescale;

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

  const incrementTimescaleUnit = useCallback(() => {
    timeActor.send({ type: 'INCREMENT_TIMESCALE_UNIT' });
  }, [timeActor]);

  const decrementTimescaleUnit = useCallback(() => {
    timeActor.send({ type: 'DECREMENT_TIMESCALE_UNIT' });
  }, [timeActor]);

  const fontSize = 1;
  const xOffset = 6;
  const iconSize = 0.6;
  return (
    <>
      <group position={position}>
        <VRIconButton
          position={[-xOffset, 0, 0]}
          iconSrc="icons/MdiChevronLeft.svg"
          radius={iconSize}
          onClick={decrementTimescaleUnit}
        />

        <Text ref={textRef} fontSize={fontSize}>
          {'text'}
        </Text>
        <VRIconButton
          position={[xOffset, 0, 0]}
          iconSrc="icons/MdiChevronRight.svg"
          radius={iconSize}
          onClick={incrementTimescaleUnit}
        />
      </group>
    </>
  );
};
