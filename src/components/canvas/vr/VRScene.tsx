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
        {/* <CameraManager /> */}
        <VRCameraManager />
        <MockSolarSystem />
        {/* <directionalLight
          ref={dirLightRef}
          intensity={0.7}
          position={[-5, 10, 8]}
        /> */}

        {/* <RotatingObject position={[0, 1, 0]}>
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

        <VRManager />
      </>
    </>
  );
};
