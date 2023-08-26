import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  CameraControls,
  PerspectiveCamera,
  Wireframe as Wires,
} from '@react-three/drei';
import { GOLDEN_RATIO, colors } from '../vr-hud-constants';
import { VRHudButton } from '../vr-ui-components/VRHudButton';

const meta: Meta<typeof VRHudButton> = {
  title: 'VRHUD/VRHudButton',
  component: VRHudButton,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRHudButton>;

const Default: Story = {
  render: () => {
    return (
      <>
        <VRHudButtonStory />
      </>
    );
  },
};

const Wireframe: Story = {
  render: () => {
    return (
      <>
        <VRHudButtonWireframeStory />
      </>
    );
  },
};

const VRHudButtonStory = () => {
  const height = 1;
  // const width = height * GOLDEN_RATIO;
  const width = 2;
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2]} />
      <CameraControls makeDefault />
      <VRHudButton
        width={width}
        height={height}
        radius={0.25}
        backgroundColor={colors.background}
        borderColor={colors.border}
        borderWidth={0.025}
      ></VRHudButton>
    </>
  );
};

const VRHudButtonWireframeStory = () => {
  const height = 1;
  const width = height * GOLDEN_RATIO;
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2]} />
      <VRHudButton
        width={width}
        height={height}
        radius={0.2}
        backgroundColor={colors.background}
        borderColor={colors.border}
        borderWidth={0.05}
      >
        <Wires thickness={0.02} />
      </VRHudButton>
    </>
  );
};

export { Default, Wireframe };
