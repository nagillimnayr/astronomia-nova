import { Cylinder, useHelper } from '@react-three/drei';
import { useRef } from 'react';
import { type DirectionalLight, DirectionalLightHelper } from 'three';
import { Floor } from './components/Floor';
import { VRHud } from '@/components/canvas/vr/vr-hud/VRHud';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useFrame, useThree } from '@react-three/fiber';
import { VRCameraManager } from './VRCameraManager';
import { MockSolarSystem } from '@/stories/mocks/MockSolarSystem';
import { KeyPressControl } from '@/components/canvas/KeyPressControl';
import { Controllers } from '@react-three/xr';
import { VRGrabbable } from './components/VRGrabbable';
import { randFloat } from 'three/src/math/MathUtils';

const LOW_X = -15;
const HIGH_X = 15;
const LOW_Y = 0.5;
const HIGH_Y = 10;
const LOW_Z = -15;
const HIGH_Z = 15;

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

      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'magenta'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'aliceblue'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'coral'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'cornflowerblue'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'hotpink'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'magenta'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'aliceblue'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'coral'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'cornflowerblue'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'hotpink'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'magenta'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'aliceblue'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'coral'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'cornflowerblue'}
      />
      <VRGrabbable
        position={[
          randFloat(LOW_X, HIGH_X),
          randFloat(LOW_Y, HIGH_Y),
          randFloat(LOW_Z, HIGH_Z),
        ]}
        color={'hotpink'}
      />

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
