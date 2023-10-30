import { KeplerBody } from '@/components/canvas/body/kepler-body';
import { VRSlider } from '@/components/canvas/vr/vr-hud/vr-ui-components/vr-slider/VRSlider';
import {
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MIN_LATITUDE,
  MIN_LONGITUDE,
} from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type surfaceMachine } from '@/state/xstate/surface-machine/surface-machine';
import { animated, useSpring } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import { Interactive, useXR } from '@react-three/xr';
import { useSelector } from '@xstate/react';
import { capitalize } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { type Group, type Object3D, Vector3, type Vector3Tuple } from 'three';
import { type ContextFrom } from 'xstate';
import { depth } from '../../../../../constants/vr-hud-constants';
import { VRPanel } from '../vr-ui-components/vr-panel/VRPanel';
import { VRHudButton } from '../vr-ui-components/VRHudButton';
import { VRLabel } from '../vr-ui-components/VRLabel';

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
  const { uiActor, cameraActor, surfaceActor, visibilityActor } =
    MachineContext.useSelector(({ context }) => context);
  const vrSurfaceDialogActor = useSelector(
    uiActor,
    ({ context }) => context.vrSurfaceDialogActor
  );
  // const trajectories = useSelector(
  //   visibilityActor,
  //   ({ context }) => context.trajectories
  // );
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );
  const inSpace = useSelector(cameraActor, (state) => state.matches('space'));
  const isPresenting = useXR(({ isPresenting }) => isPresenting);

  const close = useCallback(() => {
    vrSurfaceDialogActor.send({ type: 'DISABLE' });
  }, [vrSurfaceDialogActor]);

  const confirm = useCallback(() => {
    vrSurfaceDialogActor.send({ type: 'DISABLE' });
    cameraActor.send('TO_SURFACE');
    // trajectories.send({ type: 'DISABLE' }); // Disable trajectories.
  }, [cameraActor, vrSurfaceDialogActor]);

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
  const armRef = useRef<Group>(null!);
  const containerRef = useRef<Group>(null!);

  // Subscribe to actor's state.
  const isActive = useSelector(vrSurfaceDialogActor, (state) =>
    state.matches('active')
  );

  const isOpen =
    (isActive && isPresenting && inSpace && Boolean(focusTarget)) ||
    defaultOpen;
  const [spring, springApi] = useSpring(() => ({
    scale: 0,
  }));

  const panelWidth = 6;
  const panelHeight = 4;
  const sliderWidth = 4;
  const buttonHeight = 0.65;
  const buttonWidth = 1.8;

  useEffect(() => {
    // const isClosed = vrSurfaceDialogActor.getSnapshot()!.matches('closed');
    const anchor = anchorRef.current;
    const arm = armRef.current;
    const container = containerRef.current;
    if (!isOpen || !(focusTarget instanceof KeplerBody)) {
      if (defaultOpen) {
        springApi.start({ scale: 1 });
      } else {
        anchor.removeFromParent();
        springApi.start({ scale: 0 });
      }
      return;
    }

    const { meanRadius } = focusTarget;

    // Attach anchor to the focus target.
    focusTarget.add(anchor);

    // Scale and position the container relative to the meanRadius
    const scale = meanRadius / 2;

    springApi.start({ scale: scale });
    // container.scale.setScalar(scale);
    const xPos = -meanRadius - scale * (panelWidth * 0.75);
    arm.position.set(xPos, 0, 0);
    container.position.set(0, 0, meanRadius * 2);
  }, [defaultOpen, focusTarget, isOpen, springApi, vrSurfaceDialogActor]);

  useFrame(({ camera }, delta, frame) => {
    // const isClosed = vrSurfaceDialogActor.getSnapshot()!.matches('closed');
    // if (isClosed && !defaultOpen) return;
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
        <group name="surface-dialog-arm" ref={armRef}>
          <animated.group
            scale={spring.scale}
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
                  width={buttonWidth}
                />
              </object3D>
              {/** Confirm Button. */}
              <object3D position-x={1.1}>
                <VRHudButton
                  label="confirm"
                  onClick={confirm}
                  height={buttonHeight}
                  width={buttonWidth}
                />
              </object3D>
            </group>
          </animated.group>
        </group>
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
