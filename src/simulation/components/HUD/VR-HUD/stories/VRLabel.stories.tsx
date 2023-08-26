import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  CameraControls,
  PerspectiveCamera,
  Wireframe as Wires,
} from '@react-three/drei';
import { GOLDEN_RATIO, colors } from '../vr-hud-constants';
import { VRLabel } from '../vr-ui-components/VRLabel';

const meta: Meta<typeof VRLabel> = {
  title: 'VRHUD/VRLabel',
  component: VRLabel,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRLabel>;

const Default: Story = {
  render: () => {
    return (
      <>
        <VRLabelStory />
      </>
    );
  },
};

const VRLabelStory = () => {
  const height = 1;
  // const width = height * GOLDEN_RATIO;
  const width = 2;
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <CameraControls makeDefault />
      <VRLabel label="Label" fontSize={1.32} />
    </>
  );
};

export { Default };
