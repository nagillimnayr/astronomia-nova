import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { useFrame } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRTimescaleSlider } from '../../vr-time-panel/vr-time-controls/VRTimescaleSlider';

const meta: Meta<typeof VRTimescaleSlider> = {
  title: 'VR-UI/vr-time-panel/VRTimescaleSlider',
  component: VRTimescaleSlider,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRTimescaleSlider>;

export const Default: Story = {
  render: () => {
    return (
      <>
        <VRTimescaleSliderStory />
      </>
    );
  },
};

const VRTimescaleSliderStory = () => {
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <CameraControls makeDefault />
      <VRTimescaleSlider position={[0, 0, 0]} />
    </>
  );
};