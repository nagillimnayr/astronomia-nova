import * as React from 'react';
import { Canvas, Props as CanvasProps } from '@react-three/fiber';
import { VRCanvas } from '@/components/canvas/vr/VRCanvas';
import { Floor } from '@/components/canvas/vr/components/Floor';
import { DefaultStyleProvider } from '@coconut-xr/koestlich';
import { color } from '../../simulation/components/HUD/VR-HUD/vr-hud-constants';

type Props = React.PropsWithChildren<CanvasProps>;
export const VRCanvasDecorator = ({ children, ...props }: Props) => {
  return (
    <>
      <VRCanvas>
        <DefaultStyleProvider color={color.foreground}>
          {children}
          <Floor position={[0, -2, 0]} />
        </DefaultStyleProvider>
      </VRCanvas>
    </>
  );
};
