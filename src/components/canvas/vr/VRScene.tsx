import {
  Dodecahedron,
  Grid,
  Icosahedron,
  PerspectiveCamera,
  Tetrahedron,
  useHelper,
} from '@react-three/drei';
import { RotatingObject } from './components/RotatingObject';
import { useRef } from 'react';
import { DirectionalLight, DirectionalLightHelper } from 'three';
import { VRManager } from './VRManager';
import { Floor } from './components/Floor';

export const VRScene = () => {
  const dirLightRef = useRef<DirectionalLight>(null!);
  useHelper(dirLightRef, DirectionalLightHelper);
  return (
    <>
      <>
        <directionalLight
          ref={dirLightRef}
          intensity={0.7}
          position={[-5, 10, -8]}
        />
        <PerspectiveCamera makeDefault position={[0, 0, -15]} />

        <RotatingObject position={[0, 0, 0]}>
          <Dodecahedron>
            <meshPhongMaterial color={'red'} />
          </Dodecahedron>
        </RotatingObject>

        <RotatingObject position={[5, 0, 0]}>
          <Icosahedron>
            <meshPhongMaterial color={'cyan'} />
          </Icosahedron>
        </RotatingObject>

        <RotatingObject position={[-5, 0, 0]}>
          <Tetrahedron>
            <meshPhongMaterial color={'cyan'} />
          </Tetrahedron>
        </RotatingObject>
        <Floor />

        <VRManager />
      </>
    </>
  );
};
