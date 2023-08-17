import {
  CameraControls,
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
import { VRHUD } from '@/simulation/components/HUD/VR-HUD/VRHUD';
import { CameraManager } from '@/simulation/components/camera-controller/CameraController';
import { PI_OVER_TWO } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useFrame } from '@react-three/fiber';

export const VRScene = () => {
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const dirLightRef = useRef<DirectionalLight>(null!);
  useHelper(dirLightRef, DirectionalLightHelper);

  useFrame((state, delta) => {
    timeActor.send({ type: 'UPDATE', deltaTime: delta });
  });

  return (
    <>
      <>
        <PerspectiveCamera makeDefault position={[0, 2, 3]} />
        <CameraControls makeDefault />
        <VRHUD position={[0, 4, 0]} />
        <directionalLight
          ref={dirLightRef}
          intensity={0.7}
          position={[-5, 10, -8]}
        />

        {/* <RotatingObject position={[0, 0, 0]}>
          <Dodecahedron>
            <meshPhongMaterial color={'red'} />
          </Dodecahedron>
        </RotatingObject> */}

        <RotatingObject position={[5, 1, 0]}>
          <Icosahedron>
            <meshPhongMaterial color={'cyan'} />
          </Icosahedron>
        </RotatingObject>

        <RotatingObject position={[-5, 1, 0]}>
          <Tetrahedron>
            <meshPhongMaterial color={'cyan'} />
          </Tetrahedron>
        </RotatingObject>
        <Floor />
        {/* 
        <VRManager /> */}
      </>
    </>
  );
};
