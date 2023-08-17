import type { Meta, StoryObj } from '@storybook/react';
import { VRDetailsPanel } from '../vr-details-panel/VRDetailsPanel';
import { VRCanvas } from '@/components/canvas/vr/VRCanvas';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';

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
        <VRDetailsPanel />
      </>
    );
  },
};
