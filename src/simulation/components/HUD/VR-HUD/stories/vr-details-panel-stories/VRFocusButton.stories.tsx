import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { MockEarthSelect } from '@/stories/mocks/MockEarthSelect';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRFocusButton } from '../../vr-details-panel/VRFocusButton';

const meta: Meta<typeof VRFocusButton> = {
  title: 'VR-UI/vr-details-panel/VRFocusButton',
  component: VRFocusButton,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRFocusButton>;

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
      <VRFocusButton width={2} />
    </>
  );
};
