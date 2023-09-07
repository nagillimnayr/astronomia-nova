/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PI_OVER_TWO } from '@/constants/constants';
import {
  animated,
  AnimationResult,
  Lookup,
  SpringValue,
  useSpring,
} from '@react-spring/three';
import { Line, Wireframe } from '@react-three/drei';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Group, Object3D, SphereGeometry, Vector3 } from 'three';
import { clamp } from 'three/src/math/MathUtils';

const MIN_PHI = -PI_OVER_TWO + Number.EPSILON;
const MAX_PHI = PI_OVER_TWO - Number.EPSILON;

type SphericalCoords = {
  radius: number;
  phi: number;
  theta: number;
};
type updateFn = (newRadius: number, newPhi: number, newTheta: number) => void;

type VRHudSphereAttachmentProps = PropsWithChildren & {
  radius: number;
  phi: number;
  theta: number;
};
export const VRHudSphereAttachment = ({
  children,
  radius,
  phi,
  theta,
}: VRHudSphereAttachmentProps) => {
  const pivotRef = useRef<Object3D>(null!);
  const attachmentRef = useRef<Group>(null!);

  const update = useRef<updateFn>(null!);
  update.current = useCallback(
    (newRadius: number, newPhi: number, newTheta: number) => {
      const pivot = pivotRef.current;
      const attachment = attachmentRef.current;
      pivot.rotation.set(0, 0, 0, 'YXZ'); // Reset pivot rotation.

      attachment.position.set(0, 0, -newRadius); // Update radius.

      // Update rotation.
      pivot.rotateY(-newTheta);
      pivot.rotateX(newPhi);
    },
    []
  );
  const handleChange = useRef<
    (result: AnimationResult<SpringValue<Lookup<unknown>>>) => void
  >(null!);
  handleChange.current = useCallback(
    (result: AnimationResult<SpringValue<Lookup<unknown>>>) => {
      // Destructure updated values.
      const { radius, phi, theta } = result.value as unknown as SphericalCoords; // Cast to spherical coords.
      update.current(radius, phi, theta);
    },
    []
  );

  const [spring, springApi] = useSpring(() => ({
    radius: clamp(radius, 0.1, 10),
    phi: clamp(phi, MIN_PHI, MAX_PHI),
    theta: theta,

    onChange(result) {
      handleChange.current(result);
    },
  }));

  useEffect(() => {
    // Will run whenever props change.

    // Update spring with new values.
    springApi.start({
      radius: clamp(radius, 0.1, 10),
      phi: clamp(phi, MIN_PHI, MAX_PHI),
      theta: theta,
    });

    update.current(radius, phi, theta);
  }, [phi, radius, springApi, theta]);

  const linePoints = useMemo(() => {
    return [new Vector3(0, 0, 0), new Vector3(0, 0, -1)];
  }, []);

  springApi.start();
  return (
    <>
      <animated.object3D name="pivot" ref={pivotRef}>
        <animated.group
          name={'attachment-point'}
          ref={attachmentRef}
          position-z={spring.radius}
        >
          {children}
        </animated.group>

        <animated.object3D scale-z={spring.radius}>
          <object3D scale-z={-1}>
            <Line points={linePoints} color={'white'} lineWidth={2} />
          </object3D>
        </animated.object3D>
      </animated.object3D>
    </>
  );
};

type VRHudSphereProps = {
  radius: number;
};
export const VRHudSphere = ({ radius }: VRHudSphereProps) => {
  const sphereGeometry = useMemo(() => {
    const radius = 1;
    const resolution = 32;
    const geometry = new SphereGeometry(radius, resolution, resolution);
    const nonIndexedGeometry = geometry.toNonIndexed(); // Necessary for
    // wireframe.
    geometry.dispose(); // Cleanup original indexed geometry.
    return nonIndexedGeometry;
  }, []);

  return (
    <>
      <animated.object3D scale={radius}>
        <mesh geometry={sphereGeometry}>
          <Wireframe
            simplify
            fillOpacity={0}
            colorBackfaces
            fillMix={1}
            stroke={'white'}
            backfaceStroke={'white'}
            thickness={0.01}
          />
        </mesh>
      </animated.object3D>
    </>
  );
};
