import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Object3D, Vector3 } from 'three';
import { camState } from '@/simulation/state/CamState';
import Vec3 from '@/simulation/types/Vec3';

export const CameraTarget = () => {
  const ref = useRef<Object3D>(null!);

  // useFrame(() => {
  //   if (!ref.current) return;

  //   const worldPos = new Vector3();
  //   ref.current.getWorldPosition(worldPos);
  //   const targetPos: Vec3 = worldPos.toArray();
  //   camState.controls
  //     .lookInDirectionOf(...ref.current.position.toArray(), false)
  //     .catch((reason) => {
  //       console.log('promise rejected: ', reason);
  //     });
  // });

  return (
    <object3D
      ref={(obj) => {
        if (!obj) return;
        ref.current = obj;
        camState.marker = obj;
      }}
    ></object3D>
  );
};
