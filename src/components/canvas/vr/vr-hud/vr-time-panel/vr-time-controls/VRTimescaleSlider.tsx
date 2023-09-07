import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { colors } from '../../../../../../constants/vr-hud-constants';
import { useCallback } from 'react';
import { type Vector3Tuple } from 'three';
import { VRSlider } from '@/components/canvas/vr/vr-hud/vr-ui-components/vr-slider/VRSlider';

type VRTimescaleSliderProps = {
  position?: Vector3Tuple;
};
export const VRTimescaleSlider = ({
  position = [0, 0, 0],
}: VRTimescaleSliderProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescale = useSelector(timeActor, ({ context }) => context.timescale);
  const minTimescale = useSelector(
    timeActor,
    ({ context }) => context.minTimescale
  );
  const maxTimescale = useSelector(
    timeActor,
    ({ context }) => context.maxTimescale
  );

  const handleValueChange = useCallback(
    (value: number) => {
      value = Math.round(value);
      timeActor.send({ type: 'SET_TIMESCALE', timescale: value });
    },
    [timeActor]
  );

  return (
    <>
      <group position={position}>
        {/** Slider */}
        <VRSlider
          incrementers
          width={8}
          height={0.5}
          thumbRadius={0.45}
          value={timescale}
          min={minTimescale}
          max={maxTimescale}
          step={1}
          onValueChange={handleValueChange}
          trackColor={'black'}
          fillColor={'white'}
          thumbColor={'white'}
          thumbBorderColor={colors.border}
        />
      </group>
    </>
  );
};
