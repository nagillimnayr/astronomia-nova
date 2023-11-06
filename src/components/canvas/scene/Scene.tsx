import { CameraManager } from '@/components/canvas/scene/camera-controller/CameraManager';
import { Simulation } from '@/components/canvas/simulation/Simulation';

import { type PropsWithChildren } from 'react';
import { useKeyboard } from './useKeyboard';
import { useAutoAnimateCamera } from './useAutoAnimateCamera';

const Scene = ({ children }: PropsWithChildren) => {
  useKeyboard();
  useAutoAnimateCamera();
  return (
    <>
      <CameraManager />
      <Simulation>{children}</Simulation>
    </>
  );
};

export default Scene;
