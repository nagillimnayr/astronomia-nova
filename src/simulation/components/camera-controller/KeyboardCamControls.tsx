import { PI, PI_OVER_TWO } from '@/simulation/utils/constants';
import { useEventListener } from '@react-hooks-library/core';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import { type Object3D, Spherical, Vector3Tuple } from 'three';
import { clamp, degToRad } from 'three/src/math/MathUtils';

const rotateSpeed = 1;
const MIN_POLAR = 0;
const MAX_POLAR = PI;

type KeyboardCamControlProps = {
  distance?: number;
  position?: Vector3Tuple;
};
export const KeyboardCamControls = ({
  distance = 2,
  position,
}: KeyboardCamControlProps) => {
  const pivotRef = useRef<Object3D>(null!);
  const sph = useMemo(() => new Spherical(distance, PI_OVER_TWO), []);
  const [spherical, setSpherical] = useState<Spherical>(sph);
  const getThree = useThree(({ get }) => get);
  useEventListener('keypress', (event) => {
    // console.log(event.key);
    switch (event.key) {
      case '8': {
        spherical.phi = clamp(
          spherical.phi + degToRad(rotateSpeed),
          MIN_POLAR,
          MAX_POLAR
        );
        break;
      }
      case '2': {
        spherical.phi = clamp(
          spherical.phi - degToRad(rotateSpeed),
          MIN_POLAR,
          MAX_POLAR
        );
        break;
      }
      case '4': {
        spherical.theta -= degToRad(rotateSpeed);
        break;
      }
      case '6': {
        spherical.theta += degToRad(rotateSpeed);
        break;
      }
    }
  });

  useFrame((state, delta) => {
    const pivot = pivotRef.current;
    const { camera, invalidate } = state;
    pivot.rotation.set(0, 0, 0);
    pivot.add(camera);
    camera.position.set(0, 0, spherical.radius);
    spherical.makeSafe();
    pivot.rotateY(spherical.theta);

    const polar = PI_OVER_TWO - spherical.phi;
    pivot.rotateX(polar);
    invalidate();
  });

  return (
    <>
      <object3D
        position={position}
        ref={(obj) => {
          if (!obj) return;
          pivotRef.current = obj;
          const { camera } = getThree();
          obj.add(camera);
          camera.position.set(0, 0, spherical.radius);
        }}
      >
        <PerspectiveCamera makeDefault />
      </object3D>
    </>
  );
};
