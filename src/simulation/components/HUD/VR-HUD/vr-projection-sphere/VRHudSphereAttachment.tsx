/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useSpring, animated } from '@react-spring/three';
import { VRPanel } from '../vr-ui-components/VRPanel';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import {
  DoubleSide,
  Object3D,
  SphereGeometry,
  Spherical,
  Vector3,
} from 'three';
import { METER, PI_OVER_TWO } from '@/simulation/utils/constants';
import { Circle, Line, Wireframe } from '@react-three/drei';
import { useEventListener } from '@react-hooks-library/core';
import { clamp } from 'three/src/math/MathUtils';
import { PI } from '../../../../utils/constants';

const MIN_PHI = -PI_OVER_TWO + Number.EPSILON;
const MAX_PHI = PI_OVER_TWO - Number.EPSILON;

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
  const [spring, springApi] = useSpring(() => ({
    radius: clamp(radius, 0.1, 10),
    phi: -clamp(phi, MIN_PHI, MAX_PHI),
    theta: -theta,
  }));

  useEffect(() => {
    pivotRef.current.rotation.reorder('YXZ');
  }, []);

  useEffect(() => {
    springApi.start({
      radius: clamp(radius, 0.1, 10),
      phi: -clamp(phi, MIN_PHI, MAX_PHI),
      theta: -theta,
    });
  }, [phi, radius, springApi, theta]);

  // const linePoints = useMemo(() => {
  //   return [new Vector3(0, 0, 0), new Vector3(0, 0, 1)];
  // }, []);

  // const sphereGeometry = useMemo(() => {
  //   const radius = 1;
  //   const resolution = 16;
  //   const geometry = new SphereGeometry(radius, resolution, resolution);
  //   const nonIndexedGeometry = geometry.toNonIndexed(); // Necessary for wireframe.
  //   geometry.dispose(); // Cleanup original indexed geometry.
  //   return nonIndexedGeometry;
  // }, []);
  return (
    <>
      <group rotation-y={PI}>
        <animated.object3D
          name="pivot"
          ref={pivotRef}
          rotation-y={spring.theta}
          rotation-x={spring.phi}
        >
          <animated.group
            name={'attachment-point'}
            position-z={spring.radius}
            rotation-y={PI}
          >
            {children}
          </animated.group>

          {/* <animated.object3D scale={spring.radius}>
            <Line points={linePoints} color={'white'} lineWidth={2} />
          </animated.object3D> */}
        </animated.object3D>
        {/* <animated.object3D scale={spring.radius}>
          <mesh geometry={sphereGeometry}>
            <Wireframe
              simplify
              fillOpacity={0}
              colorBackfaces
              fillMix={1}
              stroke={'white'}
              backfaceStroke={'white'}
            />
          </mesh>
        </animated.object3D> */}
      </group>
    </>
  );
};
