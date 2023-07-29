import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import {
  Billboard,
  Box,
  Plane,
  RenderTexture,
  useFBO,
} from '@react-three/drei';
import { createPortal, useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useContext, useMemo } from 'react';
import { Scene } from 'three';

const CamViewRenderTarget = () => {
  const { cameraService } = useContext(GlobalStateContext);
  const surfaceCamera = useSelector(
    cameraService,
    (state) => state.context.surfaceCamera
  );
  const getThree = useSelector(
    cameraService,
    (state) => state.context.getThree
  );

  const renderTarget = useFBO(window.innerWidth / 4, window.innerHeight / 4);

  // const scene = useMemo(() => {
  //   const scene = new Scene();
  //   return scene;
  // }, []);

  useFrame(({ gl }) => {
    if (!surfaceCamera || !getThree) return;
    const scene = getThree().scene;
    gl.setRenderTarget(renderTarget);
    gl.render(scene, surfaceCamera);
    gl.setRenderTarget(null);
  });

  const aspect = window.innerWidth / window.innerHeight;
  const size = 12;

  // if (!surfaceCamera) return;
  return (
    <>
      <Plane args={[size, size / aspect, 1]} position={[-14, 10, 0]}>
        <meshBasicMaterial map={renderTarget.texture} />
      </Plane>
      {/* {createPortal(
        <>
          <Box args={[small, small, small]}>
            <meshBasicMaterial color={'blue'} />
          </Box>
        </>,
        scene
      )} */}
      {/* <Box args={[size, size, size]}>
        <meshBasicMaterial map={renderTarget.texture} color={'red'} />
      </Box> */}
    </>
  );
};

export { CamViewRenderTarget };
