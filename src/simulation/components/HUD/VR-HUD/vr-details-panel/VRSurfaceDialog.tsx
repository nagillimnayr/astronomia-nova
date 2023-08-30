import { Vector3Tuple } from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useActor, useSelector } from '@xstate/react';
import { useCallback, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import {
  MIN_LATITUDE,
  MAX_LATITUDE,
  MIN_LONGITUDE,
  MAX_LONGITUDE,
} from '@/simulation/utils/constants';
import { VRPanel } from '../vr-ui-components/VRPanel';
import { VRHudButton } from '../vr-ui-components/VRHudButton';
import { depth } from '../vr-hud-constants';
import { VRSlider } from '../vr-ui-components/vr-slider/VRSlider';
import { VRLabel } from '../vr-ui-components/VRLabel';
import { surfaceMachine } from '@/state/xstate/surface-machine/surface-machine';
import { type ContextFrom } from 'xstate';
import { capitalize } from 'lodash';

type VRSurfaceDialogProps = {
  position?: Vector3Tuple;
};
export const VRSurfaceDialog = ({ position }: VRSurfaceDialogProps) => {
  const { uiActor, cameraActor, surfaceActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const { surfaceDialogActor } = useSelector(uiActor, ({ context }) => context);

  const close = useCallback(() => {
    surfaceDialogActor.send({ type: 'CLOSE' });
  }, [surfaceDialogActor]);

  const confirm = useCallback(() => {
    surfaceDialogActor.send({ type: 'CLOSE' });
    cameraActor.send('TO_SURFACE');
  }, [cameraActor, surfaceDialogActor]);

  const handleLatitudeChange = useCallback((newValue: number) => {
    surfaceActor.send({ type: 'SET_LATITUDE', value: newValue });
  }, []);
  const handleLongitudeChange = useCallback((newValue: number) => {
    surfaceActor.send({ type: 'SET_LONGITUDE', value: newValue });
  }, []);

  return (
    <>
      <animated.group position={position}>
        <VRPanel width={8} height={4} />

        {/** Latitude Slider. */}
        <CoordinateSlider
          position={[0, 1.25, depth.xs]}
          target={'latitude'}
          onValueChange={handleLatitudeChange}
          min={MIN_LATITUDE}
          max={MAX_LATITUDE}
        />
        {/** Longitude Slider. */}
        <CoordinateSlider
          position={[0, 0, depth.xs]}
          target={'longitude'}
          onValueChange={handleLongitudeChange}
          min={MIN_LONGITUDE}
          max={MAX_LONGITUDE}
        />

        {/** Cancel Button. */}
        <VRHudButton
          position={[-1.75, -1, depth.xs]}
          label="Cancel"
          onClick={close}
        />
        {/** Confirm Button. */}
        <VRHudButton
          position={[1.75, -1, depth.xs]}
          label="Confirm"
          onClick={confirm}
        />
      </animated.group>
    </>
  );
};

type CoordinateSliderProps = {
  position?: Vector3Tuple;
  target: keyof ContextFrom<typeof surfaceMachine>;
  onValueChange: (newValue: number) => void;
  min: number;
  max: number;
};
const CoordinateSlider = ({
  position,
  target,
  onValueChange,
  min,
  max,
}: CoordinateSliderProps) => {
  const { surfaceActor } = MachineContext.useSelector(({ context }) => context);

  const value = useSelector(surfaceActor, ({ context }) => context[target]);
  const label = capitalize(target);

  const sliderWidth = 4;
  const sliderHeight = 0.1;
  const thumbRadius = 0.1;
  const step = 0.1;
  const fontSize = 0.35;
  const halfWidth = sliderWidth / 2;
  // const yOffset = 2 * thumbRadius + sliderHeight + fontSize;
  const yOffset = sliderHeight + fontSize / 2;
  return (
    <>
      <group position={position}>
        <VRLabel
          position={[-halfWidth, yOffset, 0]}
          label={label}
          fontSize={fontSize}
          anchorX={'left'}
        />
        <VRLabel
          position={[halfWidth, yOffset, 0]}
          label={value.toFixed(1)}
          fontSize={fontSize}
          anchorX={'right'}
        />
        <VRSlider
          position={[0, -yOffset, 0]}
          min={min}
          max={max}
          value={value}
          width={sliderWidth}
          height={sliderHeight}
          thumbRadius={thumbRadius}
          step={step}
          onValueChange={onValueChange}
        />
      </group>
    </>
  );
};
