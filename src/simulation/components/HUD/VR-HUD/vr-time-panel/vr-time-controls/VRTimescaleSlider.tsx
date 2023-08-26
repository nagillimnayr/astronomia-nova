import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { border, colors, icons, text } from '../../vr-hud-constants';
import { useCallback } from 'react';
import { Center, Circle, Svg, Text } from '@react-three/drei';
import { type Vector3Tuple } from 'three';
import { VRTimescaleIncrementButton } from './VRTimescaleIncrementButton';

type VRTimescaleSliderProps = {
  position?: Vector3Tuple;
};
export const VRTimescaleSlider = ({
  position = [0, 0, 0],
}: VRTimescaleSliderProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescale = useSelector(timeActor, ({ context }) => context.timescale);

  const handleValueChange = useCallback(
    (value: number) => {
      value = Math.floor(value);
      timeActor.send({ type: 'SET_TIMESCALE', timescale: value });
    },
    [timeActor]
  );

  const size = icons.base;
  return (
    <>
      <group position={position}>
        {/** Decrement Timescale. */}
        <VRTimescaleIncrementButton position={[-5, 0, 0]} reverse />

        {/** Slider */}

        {/** Increment Timescale. */}
        <VRTimescaleIncrementButton position={[5, 0, 0]} />
      </group>
    </>
  );
};
