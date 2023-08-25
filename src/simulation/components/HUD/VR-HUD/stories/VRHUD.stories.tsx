import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';

import { PropsWithChildren } from 'react';
import { useFrame } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { VROutliner } from '../vr-outliner/VROutliner';
import { MockSolarSystem } from '@/stories/mocks/MockSolarSystem';
import { VRHud } from '../VRHud';
import { MockEarthSelect } from '@/stories/mocks/MockEarthSelect';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRCameraManager } from '@/components/canvas/vr/VRCameraManager';
import { VRManager } from '@/components/canvas/vr/VRManager';

const meta: Meta<typeof VRHud> = {
  title: 'VRHUD/VRHUD',
  component: VRHud,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRHud>;

export const Default: Story = {
  render: () => {
    return (
      <>
        <VRHUDStory />
      </>
    );
  },
};

const VRHUDStory = () => {
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  useFrame((state, delta) => {
    timeActor.send({ type: 'UPDATE', deltaTime: delta });
  });
  return (
    <>
      <MockSolarSystem />
      <MockEarthSelect />
      <VRHud defaultOpen />
      {/* <VRCameraManager /> */}

      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <CameraControls makeDefault />
      <VRManager />
      <directionalLight intensity={1} position={[0, 0, -100]} />
    </>
  );
};
