import { VRControls } from './vr-controls/VRControls';
import { VRPlayer } from './VRPlayer';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useController, useXR, useXREvent } from '@react-three/xr';
import { Circle, Ring, Sphere } from '@react-three/drei';
import { DoubleSide, Group, Intersection, Line, Mesh, Vector3 } from 'three';
import { ORIGIN, Y_AXIS, Z_AXIS } from '@/simulation/utils/constants';
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
      <group
        visible={isPresenting}
        name={`hover-indicator-${handedness}`}
        ref={indicatorRef}
        scale={radius}
      >
        <Sphere scale={0.2} />
        {/* <axesHelper args={[radius * 2]} scale={200} /> */}
        <arrowHelper args={[Z_AXIS, ORIGIN, 10, 'cyan']} />
        <group position-z={0.1}>
          <anim.Ring
            name={`hover-indicator-ring-${handedness}`}
            args={ringArgs}
            ref={ringRef}
            scale={spring.scale}
          >
            <meshBasicMaterial side={DoubleSide} color={'white'} />
            {/* <anim.Circle
              material-transparent={true}
              material-opacity={spring.opacity}
            /> */}
          </anim.Ring>
        </group>
      </group>
    </>
  );
};
