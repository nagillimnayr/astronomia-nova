import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { MockEarthSelect } from '@/stories/mocks/MockEarthSelect';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRSurfaceButton } from '../vr-details-panel/VRSurfaceButton';

const meta: Meta<typeof VRSurfaceButton> = {
  title: 'VRHUD/VRDetailsPanel/VRSurfaceButton',
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
      {/* <MockEarthSelect /> */}
      <VRSurfaceButton width={2} />
    </>
  );
};
