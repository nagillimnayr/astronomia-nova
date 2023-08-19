import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { PerspectiveCamera, Wireframe as Wires } from '@react-three/drei';
import { VRPanel } from '../vr-ui-components/VRPanel';
import { GOLDEN_RATIO, colors } from '../vr-hud-constants';

const meta: Meta<typeof VRPanel> = {
  title: 'VRHUD/VRPanel',
  component: VRPanel,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRPanel>;

const Default: Story = {
  render: () => {
    return (
      <>
        <VRPanelStory />
      </>
    );
  },
};

const Wireframe: Story = {
  render: () => {
    return (
      <>
        <VRPanelWireframeStory />
      </>
    );
  },
};

const VRPanelStory = () => {
  const height = 1;
  const width = height * GOLDEN_RATIO;
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2]} />
      <VRPanel
        width={width}
        height={height}
        borderRadius={0.25}
        backgroundColor={colors.background}
        borderColor={colors.border}
        borderWidth={0.025}
      ></VRPanel>
    </>
  );
};

const VRPanelWireframeStory = () => {
  const height = 1;
  const width = height * GOLDEN_RATIO;
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2]} />
      <VRPanel
        width={width}
        height={height}
        borderRadius={0.2}
        backgroundColor={colors.background}
        borderColor={colors.border}
        borderWidth={0.05}
      >
        <Wires thickness={0.02} />
      </VRPanel>
    </>
  );
};

export { Default, Wireframe };
