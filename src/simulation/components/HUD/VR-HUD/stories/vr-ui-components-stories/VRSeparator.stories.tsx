import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { colors } from '../../vr-hud-constants';
import { VRSeparator } from '../../vr-ui-components/VRSeparator';

const meta: Meta<typeof VRSeparator> = {
  title: 'VR-UI/components/VRSeparator',
  component: VRSeparator,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
  argTypes: {
    height: { control: { type: 'range', min: 0.01, max: 2, step: 0.01 } },
    width: { control: { type: 'range', min: 0.01, max: 5, step: 0.01 } },
    color: { control: { type: 'color' } },
  },
};

export default meta;
type Story = StoryObj<typeof VRSeparator>;

const Default: Story = {
  render: (args) => {
    return (
      <>
        <PerspectiveCamera makeDefault position={[0, 0, 2]} />
        <CameraControls makeDefault />
        <VRSeparator {...args} />
      </>
    );
  },
  args: {
    height: 0.1,
    width: 2,
    color: colors.foreground,
  },
};

export { Default };
