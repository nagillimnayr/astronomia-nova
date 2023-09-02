import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { colors, text } from '../vr-hud-constants';
import { useCallback, useRef } from 'react';
import { Text } from '@react-three/drei';
import { type Vector3Tuple } from 'three';
import { type TextMesh } from '@/type-declarations/troika-three-text/Text';
import { useEffect } from 'react';

type VRTimescaleDisplayProps = {
  position?: Vector3Tuple;
};
export const VRTimescaleDisplay = ({
  position = [0, 0, 0],
}: VRTimescaleDisplayProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescale = timeActor.getSnapshot()!.context.timescale;

  const plural = Math.abs(timescale) === 1 ? 's' : '';
  const text = `${timescale} Hour${plural} / Second`;
  const textRef = useRef<TextMesh>(null!);

  // Subscribe to state changes in useEffect so that the component wont rerender on state change, but we can update the view directly
  useEffect(() => {
    const subscription = timeActor.subscribe(({ context }) => {
      const timescale = context.timescale;
      const plural = Math.abs(timescale) === 1 ? '' : 's';

      const text = `${context.timescale.toString()} Hour${plural} / Second`;
      textRef.current.text = text;
    });

    // Unsubscribe on dismount.
    return () => subscription.unsubscribe();
  }, [timeActor]);

  const fontSize = 1;
  return (
    <>
      <group position={position}>
        <Text ref={textRef} fontSize={fontSize}>
          {text}
        </Text>
      </group>
    </>
  );
};
