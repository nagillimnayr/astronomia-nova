import { VRControls } from './vr-controls/VRControls';
import { VRPlayer } from './VRPlayer';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useController, useXR, useXREvent } from '@react-three/xr';
import { Circle, Ring } from '@react-three/drei';
import { DoubleSide, Group, Intersection, Line, Mesh, Vector3 } from 'three';
import { Y_AXIS } from '@/simulation/utils/constants';
import { useSpring, animated } from '@react-spring/three';
import { anim } from '../../../simulation/components/animated-components';

const _camWorldPos = new Vector3();
const _worldPos = new Vector3();
const _objWorldPos = new Vector3();
const _worldNormal = new Vector3();
const _lookPos = new Vector3();

type VRHoverIndicatorProps = {
  handedness: XRHandedness;
  radius?: number;
  rayLength?: number;
};
export const VRHoverIndicator = ({
  handedness,
  radius = 0.02,
  rayLength = 1e6,
}: VRHoverIndicatorProps) => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const getXR = useXR(({ get }) => get);
  const isPresenting = useXR(({ isPresenting }) => isPresenting);

  const controller = useController(handedness);
  // console.log(`${handedness} controller:`, controller?.uuid);
  const indicatorRef = useRef<Group>(null!);
  const circleRef = useRef<Mesh>(null!);
  const ringRef = useRef<Mesh>(null!);

  useFrame(({ camera }, _, frame) => {
    if (!(frame instanceof XRFrame)) return;
    const indicator = indicatorRef.current;
    if (!indicator) return;

    // Scale relative to distance from camera.
    camera.getWorldPosition(_camWorldPos);
    indicator.getWorldPosition(_worldPos);
    const distance = _worldPos.distanceTo(_camWorldPos);
    indicator.scale.setScalar(radius * distance);
  });

  const [spring, springRef] = useSpring(() => ({
    scale: 1,
    opacity: 0,
  }));

  // Decrease radius on select.
  useXREvent(
    'selectstart',
    () => {
      springRef.start({ scale: 0.5, opacity: 0.35 });
    },
    { handedness: handedness }
  );
  useXREvent(
    'selectend',
    () => {
      springRef.start({ scale: 1, opacity: 0 });
    },
    { handedness: handedness }
  );

  const ringArgs: [number, number, number] = useMemo(() => {
    const outerRadius = 1;
    const innerRadius = 0.9;
    const segments = 32;
    return [innerRadius, outerRadius, segments];
  }, []);

  return (
    <>
      <animated.object3D scale={spring.scale}>
        <group
          visible={isPresenting}
          name={`hover-indicator-${handedness}`}
          ref={indicatorRef}
          scale={radius}
          position-z={0.01} // Slight offset to avoid clipping.
        >
          {/* <axesHelper args={[radius * 2]} /> */}
          <Circle
            name={`hover-indicator-circle-${handedness}`}
            ref={circleRef}
            scale={0.2}
          >
            <meshBasicMaterial side={DoubleSide} color={'white'} />
          </Circle>
          <Ring
            name={`hover-indicator-ring-${handedness}`}
            args={ringArgs}
            ref={ringRef}
          >
            <meshBasicMaterial side={DoubleSide} color={'white'} />
            <anim.Circle
              material-transparent={true}
              material-opacity={spring.opacity}
            />
          </Ring>
        </group>
      </animated.object3D>
    </>
  );
};
