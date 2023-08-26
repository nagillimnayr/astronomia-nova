import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { VRTimePanel } from '../../vr-time-panel/VRTimePanel';

import { PropsWithChildren } from 'react';
import { useFrame } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';

const meta: Meta<typeof VRTimePanel> = {
  title: 'VR-UI/vr-time-panel/VRTimePanel',
  component: VRTimePanel,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRTimePanel>;

export const Default: Story = {
  render: () => {
    return (
      <>
        <VRTimePanelStory />
      </>
    );
  },
};

const VRTimePanelStory = ({ children }: PropsWithChildren) => {
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  useFrame((state, delta) => {
    timeActor.send({ type: 'UPDATE', deltaTime: delta });
  });
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <CameraControls makeDefault />
      <VRTimePanel position={[0, 0, 0]} />
    </>
  );
};
