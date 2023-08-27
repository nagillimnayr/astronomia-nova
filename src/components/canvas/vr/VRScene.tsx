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
import { useEffect, useRef } from 'react';
import { DirectionalLight, DirectionalLightHelper } from 'three';
import { VRManager } from './VRManager';
import { Floor } from './components/Floor';
import { VRHud } from '@/simulation/components/HUD/VR-HUD/VRHud';
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
import { KeyPressControl } from '@/simulation/components/KeyPressControl';
import { Controllers } from '@react-three/xr';
import { VRGrabbable } from './components/VRGrabbable';
import { SpringScaleObject } from './components/SpringScaleObject';

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
      <VRCameraManager position={[0, 0, 0]} />

      <MockSolarSystem />
      <directionalLight
        ref={dirLightRef}
        intensity={0.7}
        position={[-5, 10, 8]}
      />
      <ambientLight intensity={0.75} />

      {/* <RotatingObject position={[0, 1, -5]}>
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
      </RotatingObject> */}

      <SpringScaleObject position={[7, 1, 3]}>
        <VRGrabbable color={'magenta'} />
      </SpringScaleObject>
      <SpringScaleObject position={[2, 1, -4]}>
        <VRGrabbable color={'aliceblue'} />
      </SpringScaleObject>
      <SpringScaleObject position={[-6, 1, 2]}>
        <VRGrabbable color={'coral'} />
      </SpringScaleObject>
      <SpringScaleObject position={[-3, 1, 8]}>
        <VRGrabbable color={'cornflowerblue'} />
      </SpringScaleObject>
      <SpringScaleObject position={[-3, 1, -4]}>
        <VRGrabbable color={'indigo'} />
      </SpringScaleObject>

      <Floor />

      <Cylinder
        args={[0.05, 0.05, 1, 32]}
        position={[0, 0.5, 0]}
        material-color={'blue'}
      />
      <Controllers />
      <VRHud />
      {/* <VRDebugPortal position={[0, 0.5, -2]} scale={0.05} /> */}
      <KeyPressControl />
    </>
  );
};
