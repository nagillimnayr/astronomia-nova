import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { VRTimePanel } from '../VRTimePanel';
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

const VRTimePanelStory = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
      <CameraControls makeDefault />
      <VRTimePanel position={[0, 2, 0]} />
    </>
  );
};
