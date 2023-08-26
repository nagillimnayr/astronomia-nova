import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';

import { PropsWithChildren } from 'react';
import { useFrame } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { MockSolarSystem } from '@/stories/mocks/MockSolarSystem';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRSettingsMenu } from '../vr-settings-menu/VRSettingsMenu';
import { VRSettingsButton } from '../vr-settings-menu/VRSettingsButton';

const meta: Meta<typeof VRSettingsMenu> = {
  title: 'VR-UI/VRSettingsMenu',
  component: VRSettingsMenu,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRSettingsMenu>;

export const Default: Story = {
  render: () => {
    return (
      <>
        <VRSettingsMenuStory />
      </>
    );
  },
};

const VRSettingsMenuStory = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2.5]} />
      <CameraControls makeDefault />
      {/* <VRSettingsButton position={[1, 1, 0]} />
      <VRSettingsMenu defaultOpen /> */}
    </>
  );
};
