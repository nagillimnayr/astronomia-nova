import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';

import { PropsWithChildren } from 'react';
import { useFrame } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { VROutliner } from '../vr-outliner/VROutliner';
import { MockSolarSystem } from '@/stories/mocks/MockSolarSystem';
import { VRHUD } from '../VRHUD';
import { MockEarthSelect } from '@/stories/mocks/MockEarthSelect';

const meta: Meta<typeof VRHUD> = {
  title: 'VRHUD/VRHUD',
  component: VRHUD,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRHUD>;

export const Default: Story = {
  render: () => {
    return (
      <>
        <VRHUDStory />
      </>
    );
  },
};

const VRHUDStory = () => {
  return (
    <>
      <MockSolarSystem />
      <MockEarthSelect />
      <VRHUD />
    </>
  );
};
