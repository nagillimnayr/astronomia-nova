import * as React from 'react';
import { Canvas, Props as CanvasProps } from '@react-three/fiber';
import { VRCanvas } from '@/components/canvas/vr/VRCanvas';
import { Floor } from '@/components/canvas/vr/components/Floor';
import { DefaultStyleProvider } from '@coconut-xr/koestlich';
import { colors } from '../../simulation/components/HUD/VR-HUD/vr-hud-constants';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';

type Props = React.PropsWithChildren<CanvasProps>;
export const VRCanvasDecorator = ({ children, ...props }: Props) => {
  return (
    <>
      <VRCanvas>
        <PerspectiveCamera makeDefault position={[0, 0, 2]} />
        <CameraControls makeDefault />
        <DefaultStyleProvider
          color={colors.foreground}
          borderColor={colors.border}
        >
          {children}
          <Floor position={[0, -2, 0]} />
        </DefaultStyleProvider>
      </VRCanvas>
    </>
  );
};
