import type { Meta, StoryObj } from '@storybook/react';
import { VRDetailsPanel } from '../vr-details-panel/VRDetailsPanel';
import { VRCanvas } from '@/components/canvas/vr/VRCanvas';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { MockEarthSelect } from '@/stories/mock/MockEarthSelect';

const meta: Meta<typeof VRDetailsPanel> = {
  title: 'VRHUD/VRDetailsPanel',
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
      <MockEarthSelect />
      <VRDetailsPanel />
    </>
  );
};