import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRPanel } from '../vr-panel/VRPanel';
import { colors } from '../../../../../../constants/vr-hud-constants';

const meta: Meta<typeof VRPanel> = {
  title: 'VR-UI/components/VRPanel',
  component: VRPanel,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
  argTypes: {
    height: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
    width: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
    radius: { control: { type: 'range', min: 0.01, max: 0.5, step: 0.01 } },
    borderWidth: {
      control: { type: 'range', min: 0.01, max: 0.5, step: 0.005 },
    },
    backgroundColor: { control: { type: 'color' } },
    borderColor: { control: { type: 'color' } },
  },
};

export default meta;
type Story = StoryObj<typeof VRPanel>;

const Default: Story = {
  render: (args) => {
    return (
      <>
        <PerspectiveCamera makeDefault position={[0, 0, 2]} />
        <CameraControls makeDefault />
        <VRPanel {...args} />
      </>
    );
  },
  args: {
    height: 1,
    width: 2,
    radius: 0.2,
    borderWidth: 0.02,
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
};

export { Default };
