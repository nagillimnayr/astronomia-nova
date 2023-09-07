import { VRSurfaceDialog } from '@/components/canvas/vr/vr-hud/vr-details-panel/VRSurfaceDialog';
import { VRCameraManager } from '@/components/canvas/vr/VRCameraManager';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MockEarthSelect } from '@/stories/mocks/MockEarthSelect';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof VRSurfaceDialog> = {
  title: 'VR-UI/vr-details-panel/VRSurfaceDialog',
  component: VRSurfaceDialog,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRSurfaceDialog>;

export const Default: Story = {
  render: () => {
    return (
      <>
        <VRSurfaceDialogStory />
      </>
    );
  },
};

const VRSurfaceDialogStory = () => {
  return (
    <>
      <VRCameraManager position={[0, 2, 0]} />
      <MockEarthSelect />
      <VRSurfaceDialog defaultOpen position={[0, 2, 0]} />
    </>
  );
};
