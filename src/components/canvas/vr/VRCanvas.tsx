import { Canvas } from '@react-three/fiber';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { VRScene } from './VRScene';
import { CameraControls } from '@react-three/drei';

export const VRCanvas = () => {
  return (
    <>
      <div className="relative z-10 h-full w-full ">
        <Canvas>
          <XR>
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
