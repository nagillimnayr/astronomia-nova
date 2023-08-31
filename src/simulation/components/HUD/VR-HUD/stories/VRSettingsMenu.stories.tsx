import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';

import { PropsWithChildren } from 'react';
import { useFrame } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { MockSolarSystem } from '@/stories/mocks/MockSolarSystem';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRSettingsMenu } from '../vr-settings-menu/VRSettingsMenu';
import { VRSettingsButton } from '../vr-settings-menu/VRSettingsButton';

type Props = React.ComponentProps<typeof VRSettingsMenu> & { size: number };
const meta: Meta<Props> = {
  title: 'VR-UI/VRSettingsMenu',
  component: VRSettingsMenu,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],

  argTypes: {
    size: { control: { type: 'range', min: 0.01, max: 1, step: 0.001 } },
  },
};

export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {
  render: (args) => {
    return (
      <>
        <PerspectiveCamera makeDefault position={[0, 0, 2.5]} />
        <CameraControls makeDefault />
        <VRSettingsButton position={[1, 1, 0]} size={args.size} />
        <VRSettingsMenu defaultOpen {...args} />
      </>
    );
  },
  args: {
    size: 0.01,
  },
};
