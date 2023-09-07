import { VRSurfaceButton } from '@/components/canvas/vr/vr-hud/vr-details-panel/VRSurfaceButton';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MockEarthSelect } from '@/stories/mocks/MockEarthSelect';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof VRSurfaceButton> = {
  title: 'VR-UI/vr-details-panel/VRSurfaceButton',
  component: VRSurfaceButton,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRSurfaceButton>;

export const Default: Story = {
  render: () => {
    return (
      <>
        <VRDetailsPanelStory />
      </>
    );
  },
};

const VRDetailsPanelStory = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 3]} />
      <CameraControls makeDefault />
      {/** Panel is only open when a body is selected. */}
      <MockEarthSelect />
      <VRSurfaceButton width={2} />
    </>
  );
};
