import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';

import { PropsWithChildren } from 'react';
import { useFrame } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { VROutliner } from '../vr-outliner/VROutliner';
import { MockSolarSystem } from '@/stories/mocks/MockSolarSystem';
import { PerspectiveCamera } from '@react-three/drei';

const meta: Meta<typeof VROutliner> = {
  title: 'VRHUD/VROutliner',
  component: VROutliner,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VROutliner>;

export const Default: Story = {
  render: () => {
    return (
      <>
        <VROutlinerStory />
      </>
    );
  },
};

const VROutlinerStory = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2]} />
      <MockSolarSystem />
      <VROutliner />
    </>
  );
};
