import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';

import { PropsWithChildren } from 'react';
import { useFrame } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { VROutliner } from '../vr-outliner/VROutliner';
import { MockSolarSystem } from '@/stories/mocks/MockSolarSystem';

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
      <MockSolarSystem />
      <VROutliner />
    </>
  );
};
