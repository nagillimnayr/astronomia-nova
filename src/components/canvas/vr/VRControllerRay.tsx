import { PI, PI_OVER_TWO } from '@/simulation/utils/constants';
import { Line } from '@react-three/drei';
import { createPortal } from '@react-three/fiber';
import { useController } from '@react-three/xr';
import { useMemo } from 'react';
import { Euler, Vector3 } from 'three';

const RAY_LENGTH = 1e3;

type VRControllerRayProps = {
  handedness: XRHandedness;
};
export const VRControllerRay = ({ handedness }: VRControllerRayProps) => {
  const controller = useController(handedness);

  const points = useMemo(() => {
    return [new Vector3(0, 0, 0), new Vector3(0, 0, 1)];
  }, []);
  const scale = useMemo(() => {
    return new Vector3(1, 1, 1);
  }, []);
  scale.set(1, 1, RAY_LENGTH);
  const rotation = useMemo(() => {
    return new Euler(0, 0, 0);
  }, []);
  rotation.set(0, PI, 0);

  if (!controller) return;
  return createPortal(
    <>
      <Line
        points={points}
        color={'red'}
        scale={scale}
        rotation={rotation}
        lineWidth={8}
      />
    </>,
    controller.controller
  );
};
