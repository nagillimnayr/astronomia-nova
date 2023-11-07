import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSpring, animated } from '@react-spring/three';
import { Ring, Sphere } from '@react-three/drei';
import { useController, useXR, useXREvent } from '@react-three/xr';
import { useMemo, useRef } from 'react';
import { DoubleSide, type Group, type Mesh, Vector3 } from 'three';
import { anim } from '@/helpers/react-spring-utils/animated-components';
import { makeAnnularCylinderGeometry } from '@/helpers/geometry/annular-cylinder';
import { AnnularCylinder } from '../misc/AnnularCylinder';

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

  // const ringArgs: [number, number, number] = useMemo(() => {
  //   const outerRadius = 1;
  //   const innerRadius = 0.9;
  //   const segments = 32;
  //   return [innerRadius, outerRadius, segments];
  // }, []);

  return (
    <>
      <group
        visible={isPresenting}
        name={`hover-indicator-${handedness}`}
        ref={indicatorRef}
        scale={radius}
      >
        <Sphere scale={0.1} />
        {/* <axesHelper args={[radius * 2]} scale={200} /> */}
        {/* <arrowHelper args={[Z_AXIS, ORIGIN, 10, 'cyan']} /> */}
        <group position-z={0.25}>
          <animated.object3D
            ref={ringRef}
            name={`hover-indicator-ring-${handedness}`}
            scale={spring.scale}
          >
            <AnnularCylinder innerRadius={0.7} outerRadius={1} depth={0.01}>
              <meshBasicMaterial side={DoubleSide} color={'white'} />
            </AnnularCylinder>
          </animated.object3D>
        </group>
      </group>
    </>
  );
};
