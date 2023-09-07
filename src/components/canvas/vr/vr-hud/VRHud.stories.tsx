import { VRManager } from '@/components/canvas/vr/VRManager';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { MockEarthSelect } from '@/stories/mocks/MockEarthSelect';
import { MockSolarSystem } from '@/stories/mocks/MockSolarSystem';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Meta, StoryObj } from '@storybook/react';
import { VRHud } from './VRHud';

const meta: Meta<typeof VRHud> = {
  title: 'VR-UI/VRHud',
  component: VRHud,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRHud>;

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
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  useFrame((state, delta) => {
    timeActor.send({ type: 'UPDATE', deltaTime: delta });
  });
  return (
    <>
      <axesHelper />
      <MockSolarSystem />
      <MockEarthSelect />
      <VRHud defaultOpen />

      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <CameraControls makeDefault />
      <VRManager />
      <directionalLight intensity={1} position={[0, 0, -100]} />
    </>
  );
};
