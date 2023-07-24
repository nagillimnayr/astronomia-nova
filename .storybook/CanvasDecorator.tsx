import * as React from 'react';
import { Vector3 } from 'three';
import { Canvas, Props as CanvasProps } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';

type Props = React.PropsWithChildren<CanvasProps>;
export const CanvasDecorator = ({ children, ...props }: Props) => {
  return (
    <Canvas>
      {children}
      <CameraControls />
    </Canvas>
  );
};
