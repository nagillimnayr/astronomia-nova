import {
  CameraControls,
  Cylinder,
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
import { VRHUD, VRHud } from '@/simulation/components/HUD/VR-HUD/VRHUD';
import { CameraManager } from '@/simulation/components/camera-controller/CameraManager';
import { PI_OVER_TWO } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useFrame, useThree } from '@react-three/fiber';
import {
  useEnterXR,
  NonImmersiveCamera,
  ImmersiveSessionOrigin,
} from '@coconut-xr/natuerlich/react';
import { VRCameraManager } from './VRCameraManager';
import { MockSolarSystem } from '@/stories/mocks/MockSolarSystem';
import { VRStats } from './VRStats';
import { VRDebugPortal } from '@/simulation/components/HUD/VR-HUD/vr-debug/VRDebugDisplay';

export const VRScene = () => {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const dirLightRef = useRef<DirectionalLight>(null!);
  useHelper(dirLightRef, DirectionalLightHelper);
  const getThree = useThree(({ get }) => get);

  useFrame((state, delta) => {
    cameraActor.send({ type: 'UPDATE', deltaTime: delta });
    timeActor.send({ type: 'UPDATE', deltaTime: delta });
  });

  return (
    <>
      {/* <NonImmersiveCamera
          ref={(camera) => {
            if (!camera) return;
            camRef.current = camera;
            getThree().set({ camera });
          }}
          position={[0, 2, 8]}
        />
        <ImmersiveSessionOrigin position={[0, 2, 8]} /> */}

      <MockSolarSystem />
      <directionalLight
        ref={dirLightRef}
        intensity={0.7}
        position={[-5, 10, 8]}
      />
      <ambientLight intensity={0.25} />

      <RotatingObject position={[0, 1, -5]}>
        <Dodecahedron>
          <meshPhongMaterial color={'red'} />
        </Dodecahedron>
      </RotatingObject>

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
      <VRCameraManager position={[0, 0, 0]} />

      <Cylinder
        args={[0.05, 0.05, 1, 32]}
        position={[0, 0.5, 0]}
        material-color={'blue'}
      />

      <VRStats />
      <VRHud />
      <VRDebugPortal position={[0, 0, -1]} scale={0.05} />
      {/* <VRDebugPortal position={[0, 0, -1]} /> */}
    </>
  );
};
