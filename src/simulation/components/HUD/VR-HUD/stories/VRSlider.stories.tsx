import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRSlider } from '../vr-ui-components/VRSlider';
import { colors } from '../vr-hud-constants';

const meta: Meta<typeof VRSlider> = {
  title: 'VR-UI/components/VRSlider',
  component: VRSlider,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
  argTypes: {
    value: {
      control: { type: 'range', min: -100, max: 100, step: 0.1 },
    },
    trackColor: { control: { type: 'color' } },
    rangeColor: { control: { type: 'color' } },
    thumbColor: { control: { type: 'color' } },
    thumbBorderColor: { control: { type: 'color' } },
  },
};

export default meta;
type Story = StoryObj<typeof VRSlider>;

const Default: Story = {
  args: {
    position: [0, 0, 0],
    height: 0.1,
    width: 2,
    value: 0,
    thumbRadius: 0.1,
    trackColor: 'black',
    rangeColor: 'white',
    thumbColor: 'white',
    thumbBorderColor: colors.border,
  },
  render: (args) => {
    return (
      <>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <CameraControls makeDefault />
        <VRSlider {...args} min={-100} max={100} step={0.1} />
      </>
    );
  },
};

export { Default };
