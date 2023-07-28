import { PerspectiveCamera, useHelper } from '@react-three/drei';
import { useRef } from 'react';
import { CameraHelper, type Camera, type Object3D, AxesHelper } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const Observer = () => {
  const cameraRef = useRef<Camera>(null!);
  const cameraHelperRef = useHelper(cameraRef, CameraHelper);
  return (
    <>
      <object3D>
        <object3D rotation={[degToRad(90), 0, degToRad(90)]}>
          <PerspectiveCamera ref={cameraRef} near={1e-8} fov={5} />
        </object3D>
        <axesHelper args={[1e-1]} />
      </object3D>
    </>
  );
};

export { Observer };
