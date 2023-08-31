import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { VRHudSphereAttachment } from '../../vr-projection-sphere/VRHudSphereAttachment';
import { PI, PI_OVER_TWO, TWO_PI } from '@/simulation/utils/constants';
import { DoubleSide } from 'three';
import { CameraControls, Circle } from '@react-three/drei';

const meta: Meta<typeof VRHudSphereAttachment> = {
  title: 'VR-UI/vr-hud-sphere/VRHudSphereAttachment',
  component: VRHudSphereAttachment,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
  argTypes: {
    radius: { control: { type: 'range', min: 0.1, max: 10, step: 0.001 } },
    phi: {
      control: {
        type: 'range',
        min: -PI_OVER_TWO + Number.EPSILON,
        max: PI_OVER_TWO - Number.EPSILON,
        step: 0.001,
      },
    },
    theta: {
      control: { type: 'range', min: -TWO_PI, max: TWO_PI, step: 0.001 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VRHudSphereAttachment>;

const Default: Story = {
  render: (args) => {
    return (
      <>
        <CameraControls makeDefault />
        <VRHudSphereAttachment {...args}>
          <Circle>
            <meshBasicMaterial side={DoubleSide} color={'red'} />
          </Circle>
        </VRHudSphereAttachment>
        <axesHelper />
      </>
    );
  },
  args: {
    radius: 1,
    phi: PI_OVER_TWO,
    theta: 0,
  },
};

export { Default };
