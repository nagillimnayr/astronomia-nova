import type { Meta, StoryObj } from '@storybook/react';
import { VRDetailsPanel } from '../../vr-details-panel/VRDetailsPanel';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { MockEarthSelect } from '@/stories/mocks/MockEarthSelect';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';

const meta: Meta<typeof VRDetailsPanel> = {
  title: 'VR-UI/vr-details-panel/VRDetailsPanel',
  component: VRDetailsPanel,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRDetailsPanel>;

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
      <PerspectiveCamera makeDefault position={[0, 0, 2]} />
      <CameraControls makeDefault />
      {/** Panel is only open when a body is selected. */}
      <MockEarthSelect />
      <VRDetailsPanel />
    </>
  );
};
