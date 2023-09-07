import { VRTimescaleSlider } from '@/components/canvas/vr/vr-hud/vr-time-panel/vr-time-controls/VRTimescaleSlider';
import { VRCameraManager } from '@/components/canvas/vr/VRCameraManager';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import type { Meta, StoryObj } from '@storybook/react';

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
      {/* <PerspectiveCamera makeDefault position={[0, 0, 15]} />
       <CameraControls makeDefault /> */}
      <VRCameraManager />
      <VRTimescaleSlider position={[0, 0, 0]} />
    </>
  );
};
