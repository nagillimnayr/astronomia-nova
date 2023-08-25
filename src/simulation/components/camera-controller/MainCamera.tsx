import { useSelector } from '@xstate/react';
import { useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { PerspectiveCamera } from 'three';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';
import { PerspectiveCamera as PerspectiveCam } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export const MainCamera = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  const camRef = useRef<PerspectiveCamera>(null!);
  return (
    <>
      <PerspectiveCam
        makeDefault
        name="Main-Camera"
        position={[0, 0, 0]}
        near={NEAR_CLIP}
        far={FAR_CLIP}
        ref={(camera) => {
          console.log('Main-Camera:', camera);
          if (!(camera instanceof PerspectiveCamera)) return;
          if (camRef.current === camera) return;
          camRef.current = camera;
          console.log('Assigning main camera to controls');
          cameraActor.send({
            type: 'ASSIGN_CAMERA',
            camera,
          });
        }}
      ></PerspectiveCam>
    </>
  );
};
