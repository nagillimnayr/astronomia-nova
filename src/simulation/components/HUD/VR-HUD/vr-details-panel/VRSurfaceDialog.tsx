import { Group, Object3D, Vector3, Vector3Tuple } from 'three';
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
import { useFrame } from '@react-three/fiber';
import KeplerBody from '@/simulation/classes/kepler-body';
import { Interactive, useXR } from '@react-three/xr';

const _camWorldPos = new Vector3();

const dummyFn = () => {
  return;
};

type VRSurfaceDialogProps = {
  position?: Vector3Tuple;
  defaultOpen?: boolean;
};
export const VRSurfaceDialog = ({
  position,
  defaultOpen = false,
}: VRSurfaceDialogProps) => {
  const { uiActor, cameraActor, surfaceActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const { surfaceDialogActor } = useSelector(uiActor, ({ context }) => context);

  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  const isPresenting = useXR(({ isPresenting }) => isPresenting);

  const close = useCallback(() => {
    surfaceDialogActor.send({ type: 'CLOSE' });
  }, [surfaceDialogActor]);

  const confirm = useCallback(() => {
    surfaceDialogActor.send({ type: 'CLOSE' });
    cameraActor.send('TO_SURFACE');
  }, [cameraActor, surfaceDialogActor]);

  const handleLatitudeChange = useCallback(
    (newValue: number) => {
      surfaceActor.send({ type: 'SET_LATITUDE', value: newValue });
    },
    [surfaceActor]
  );
  const handleLongitudeChange = useCallback(
    (newValue: number) => {
      surfaceActor.send({ type: 'SET_LONGITUDE', value: newValue });
    },
    [surfaceActor]
  );

  const anchorRef = useRef<Object3D>(null!);
  const containerRef = useRef<Group>(null!);

  // Subscribe to actor's state.
  const isOpen = useSelector(surfaceDialogActor, (state) =>
    state.matches('open')
  );

  const visible = (Boolean(focusTarget) && isOpen) || defaultOpen;

  const panelWidth = 6;
  const panelHeight = 4;
  const sliderWidth = 4;
  const buttonHeight = 0.65;

  useEffect(() => {
    // const isClosed = surfaceDialogActor.getSnapshot()!.matches('closed');
    const anchor = anchorRef.current;
    const container = containerRef.current;
    if (!isOpen || !(focusTarget instanceof KeplerBody)) {
      if (!defaultOpen) {
        anchor.removeFromParent();
      }
      return;
    }

    const { meanRadius } = focusTarget;

    // Attach anchor to the focus target.
    focusTarget.add(anchor);

    // Scale and position the container relative to the meanRadius
    const scale = meanRadius / 2;
    container.scale.setScalar(scale);
    const xPos = -meanRadius - scale * (panelWidth * 0.75);
    container.position.set(xPos, 0, 0);
  }, [defaultOpen, focusTarget, isOpen, surfaceDialogActor]);

  useFrame(({ camera }, delta, frame) => {
    const isClosed = surfaceDialogActor.getSnapshot()!.matches('closed');
    if (isClosed && !defaultOpen) return;
    const anchor = anchorRef.current;
    const container = containerRef.current;
    const { controls } = cameraActor.getSnapshot()!.context;
    if (!controls) return;

    camera.getWorldPosition(_camWorldPos);
    controls.getCameraWorldUp(anchor.up);
    container.up.copy(anchor.up);
    anchor.lookAt(_camWorldPos); // Look at camera.
    container.lookAt(_camWorldPos); // Look at camera.
  });

  return (
    <>
      <object3D name="surface-dialog-anchor" ref={anchorRef}>
        <animated.group
          visible={visible}
          ref={containerRef}
          position={position}
        >
          <Interactive onSelect={dummyFn}>
            <VRPanel width={panelWidth} height={panelHeight} />
          </Interactive>

          {/** Sliders. */}
          <group position-y={0.5} position-z={depth.xs}>
            {/** Latitude Slider. */}
            <object3D position-y={0.55}>
              <CoordinateSlider
                width={sliderWidth}
                target={'latitude'}
                onValueChange={handleLatitudeChange}
                min={MIN_LATITUDE}
                max={MAX_LATITUDE}
              />
            </object3D>
            {/** Longitude Slider. */}
            <object3D position-y={-0.55}>
              <CoordinateSlider
                width={sliderWidth}
                target={'longitude'}
                onValueChange={handleLongitudeChange}
                min={MIN_LONGITUDE}
                max={MAX_LONGITUDE}
              />
            </object3D>
          </group>

          <group position-y={-1.25} position-z={depth.xs}>
            {/** Cancel Button. */}
            <object3D position-x={-1.2}>
              <VRHudButton
                label="cancel"
                onClick={close}
                height={buttonHeight}
              />
            </object3D>
            {/** Confirm Button. */}
            <object3D position-x={1.1}>
              <VRHudButton
                label="confirm"
                onClick={confirm}
                height={buttonHeight}
              />
            </object3D>
          </group>
        </animated.group>
      </object3D>
    </>
  );
};

type CoordinateSliderProps = {
  position?: Vector3Tuple;
  width: number;
  target: keyof ContextFrom<typeof surfaceMachine>;
  min: number;
  max: number;
  onValueChange: (newValue: number) => void;
};
const CoordinateSlider = ({
  position,
  width,
  target,
  min,
  max,
  onValueChange,
}: CoordinateSliderProps) => {
  const { surfaceActor } = MachineContext.useSelector(({ context }) => context);

  const value = useSelector(surfaceActor, ({ context }) => context[target]);
  const label = capitalize(target);

  const sliderHeight = 0.1;
  const thumbRadius = 0.1;
  const step = 0.1;
  const fontSize = 0.35;
  const halfWidth = width / 2;
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
          width={width}
          height={sliderHeight}
          thumbRadius={thumbRadius}
          step={step}
          onValueChange={onValueChange}
        />
      </group>
    </>
  );
};
