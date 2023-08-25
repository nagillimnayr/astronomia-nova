import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { border, colors, text } from '../../vr-hud-constants';
import { useCallback } from 'react';
import { Center, Circle, Svg, Text } from '@react-three/drei';
import { type Vector3Tuple } from 'three';

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

  const handleClickLeft = useCallback(() => {
    if (timescale <= 1) return;
    timeActor.send({ type: 'DECREMENT_TIMESCALE' });
  }, [timeActor, timescale]);

  const handleClickRight = useCallback(() => {
    timeActor.send({ type: 'INCREMENT_TIMESCALE' });
  }, [timeActor]);

  const iconSize = 24;
  return (
    <>
      <group position={position}>
        <Circle onClick={handleClickLeft}>
          <Center>
            <Svg src="icons/MdiChevronLeft.svg" />
          </Center>
        </Circle>
        {/**  */}
        <Circle onClick={handleClickRight}>
          <Center>
            <Svg src="icons/MdiChevronRight.svg" />
          </Center>
        </Circle>
      </group>
    </>
  );
};
