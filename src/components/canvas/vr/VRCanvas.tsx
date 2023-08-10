import { Canvas } from '@react-three/fiber';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { VRScene } from './VRScene';
import { CameraControls } from '@react-three/drei';
import { FAR, NEAR } from '../scene-constants';
import { MachineContext } from '@/state/xstate/MachineProviders';

export const VRCanvas = () => {
  const { vrActor } = MachineContext.useSelector(({ context }) => context);
  return (
    <>
      <div className="relative z-10 h-full w-full ">
        <Canvas>
          <XR
            onSessionStart={(event) => {
              const session = event.target;

              // Assign session object to external state machine and start session state.
              vrActor.send({ type: 'START_SESSION', session });
            }}
          >
            <Controllers />
            <VRScene />
            <CameraControls makeDefault />
          </XR>
        </Canvas>
        <div className="absolute bottom-10 right-20 z-20 h-fit w-fit whitespace-nowrap ">
          <VRButton />
        </div>
      </div>
    </>
  );
};
