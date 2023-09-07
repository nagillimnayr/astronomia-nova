import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import type { Meta, StoryObj } from '@storybook/react';
import { VRLabel } from '../VRLabel';

const meta: Meta<typeof VRLabel> = {
  title: 'VR-UI/components/VRLabel',
  component: VRLabel,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
  argTypes: {
    fontSize: { control: { type: 'range', min: 0.5, max: 2, step: 0.01 } },
  },
};

export default meta;
type Story = StoryObj<typeof VRLabel>;

const Default: Story = {
  render: (args) => {
    return (
      <>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <CameraControls makeDefault />
        <VRLabel {...args} />
      </>
    );
  },
  args: {
    label: 'Label',
    fontSize: 1.32,
    debug: false,
  },
};

export { Default };
