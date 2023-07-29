import {
  Billboard,
  Box,
  CameraControls,
  PerspectiveCamera,
  useFBO,
} from '@react-three/drei';
import { CamViewRenderTarget } from './CamViewRenderTarget';
import { useFrame } from '@react-three/fiber';

const CamViewScene = () => {
  useFrame(({ gl, camera, scene }) => {
    gl.render(scene, camera);
  });
  return (
    <>
      {/* <color attach="background" args={['#d6edf3']} /> */}
      {/* <perspectiveCamera position={[0, 0, -30]} near={1e-4} far={1e5} /> */}
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
      {/* <Box args={[10, 10, 10]}>
        <meshBasicMaterial color={'red'} />
      </Box> */}
      <ambientLight intensity={1} />
    </>
  );
};

export { CamViewScene };
