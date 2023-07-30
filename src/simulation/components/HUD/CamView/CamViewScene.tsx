import {
  Billboard,
  CameraControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { CamViewRenderTarget } from './CamViewRenderTarget';
import { useFrame } from '@react-three/fiber';

const CamViewScene = () => {
  // useFrame(({ gl, camera, scene }) => {
  //   gl.render(scene, camera);
  // });
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, -30]}
        near={1e-4}
        far={1e5}
      />
      <CameraControls
        makeDefault
        ref={(controls) => {
          if (!controls) return;
          controls.mouseButtons.left = 0;
          controls.mouseButtons.right = 0;
          controls.mouseButtons.middle = 0;
          controls.mouseButtons.wheel = 0;
        }}
      />
      <Billboard>
        <CamViewRenderTarget />
      </Billboard>

      <ambientLight intensity={1} />
    </>
  );
};

export { CamViewScene };
