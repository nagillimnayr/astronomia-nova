import { CameraControls } from '@react-three/drei';
import { Canvas, type Props as CanvasProps } from '@react-three/fiber';
import * as React from 'react';
import { useRef } from 'react';
import { degToRad } from 'three/src/math/MathUtils';

type Props = React.PropsWithChildren<CanvasProps>;
export const CanvasDecorator = ({ children, ...props }: Props) => {
  const controlsRef = useRef<CameraControls>(null!);
  return (
    <div className="h-screen w-screen">
      <Canvas>
        {children}
        <CameraControls
          ref={(controls) => {
            if (!controls) return;
            if (controlsRef.current === controls) return;
            controlsRef.current = controls;
            controls.rotatePolarTo(degToRad(30), true).catch((reason) => {
              console.error(reason);
            });
          }}
        />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
};
