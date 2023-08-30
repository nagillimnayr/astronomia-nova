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

type VRSurfaceDialogProps = {
  position?: Vector3Tuple;
};
export const VRSurfaceDialog = ({ position }: VRSurfaceDialogProps) => {
  const { uiActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const { surfaceDialogActor } = useSelector(uiActor, ({ context }) => context);

  const close = useCallback(() => {
    surfaceDialogActor.send({ type: 'CLOSE' });
  }, [surfaceDialogActor]);

  const confirm = useCallback(() => {
    cameraActor.send('TO_SURFACE');
    surfaceDialogActor.send({ type: 'CLOSE' });
  }, [cameraActor, surfaceDialogActor]);

  return (
    <>
      <animated.group position={position}>
        <VRPanel width={8} height={4} />

        {/** Sliders. */}
        <CoordinateSliders position={[0, 0.5, depth.xs]} />

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

type CoordinateSlidersProps = {
  position?: Vector3Tuple;
};
const CoordinateSliders = ({ position }: CoordinateSlidersProps) => {
  const { surfaceActor } = MachineContext.useSelector(({ context }) => context);

  const { latitude, longitude } = useSelector(
    surfaceActor,
    ({ context }) => context
  );

  const sliderWidth = 4;
  const sliderHeight = 0.1;
  const thumbRadius = 0.1;
  const step = 0.1;
  const fontSize = 0.35;
  const yOffset = 2 * thumbRadius + sliderHeight + fontSize;
  return (
    <>
      <group position={position}>
        {/** Latitude. */}
        <VRLabel
          position={[
            0,
            yOffset + thumbRadius + 1.5 * sliderHeight + fontSize / 2,
            0,
          ]}
          label="Latitude"
          fontSize={fontSize}
        />
        <VRSlider
          position={[0, yOffset, 0]}
          min={MIN_LATITUDE}
          max={MAX_LATITUDE}
          value={0}
          width={sliderWidth}
          height={sliderHeight}
          thumbRadius={thumbRadius}
          step={step}
        />
        {/** Longitude. */}
        <VRLabel
          position={[
            0,
            -yOffset + thumbRadius + 1.5 * sliderHeight + fontSize / 2,
            0,
          ]}
          label="Longitude"
          fontSize={fontSize}
        />
        <VRSlider
          position={[0, -yOffset, 0]}
          min={MIN_LONGITUDE}
          max={MAX_LONGITUDE}
          value={0}
          width={sliderWidth}
          height={sliderHeight}
          thumbRadius={thumbRadius}
          step={step}
        />
      </group>
    </>
  );
};
