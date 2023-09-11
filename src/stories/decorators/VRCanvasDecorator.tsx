import { Floor } from '@/components/canvas/vr/components/Floor';
import { VRCanvas } from '@/components/canvas/vr/VRCanvas';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type Props as CanvasProps, useFrame } from '@react-three/fiber';
import * as React from 'react';

type Props = React.PropsWithChildren<CanvasProps>;
export const VRCanvasDecorator = ({ children, ...props }: Props) => {
  return (
    <>
      <VRCanvas>
        <VRStoryScene>{children}</VRStoryScene>
      </VRCanvas>
    </>
  );
};

const VRStoryScene = ({ children }: React.PropsWithChildren) => {
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  useFrame((state, delta) => {
    cameraActor.send({ type: 'UPDATE', deltaTime: delta });
    timeActor.send({ type: 'UPDATE', deltaTime: delta });
  });
  return (
    <>
      <directionalLight position={[0, 0, 100]} intensity={0.15} />
      <ambientLight intensity={0.5} />
      {children}
      <Floor position={[0, -2, 0]} />
    </>
  );
};
