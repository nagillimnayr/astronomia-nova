import { PerspectiveCamera, useHelper } from '@react-three/drei';
import { useRef } from 'react';
import { CameraHelper, type Camera } from 'three';

const Observer = () => {
  const cameraRef = useRef<Camera>(null!);
  useHelper(cameraRef, CameraHelper);
  return (
    <>
      <object3D>
        <PerspectiveCamera ref={cameraRef} />
      </object3D>
    </>
  );
};

export { Observer };
