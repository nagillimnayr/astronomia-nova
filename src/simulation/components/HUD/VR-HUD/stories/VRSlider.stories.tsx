import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRSlider } from '../vr-ui-components/VRSlider';
import { colors } from '../vr-hud-constants';

const meta: Meta<typeof VRSlider> = {
  title: 'VR-UI/components/VRSlider',
  component: VRSlider,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
};

export default meta;
type Story = StoryObj<typeof VRSlider>;

const Default: Story = {
  render: () => {
    return (
      <>
        <VRSliderStory />
      </>
    );
  },
};

const VRSliderStory = () => {
  const height = 0.1;
  const width = 2;
  const thumbRadius = 0.15;

  const min = -100;
  const max = 100;
  const step = 1;
  const value = -20;
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 3]} />
      <CameraControls makeDefault />
      <VRSlider
        position={[0, 0.5, 0]}
        width={width}
        height={height}
        thumbRadius={thumbRadius}
        trackColor={colors.background}
        rangeColor={'white'}
        thumbColor={'white'}
        thumbBorderColor={colors.border}
        min={min}
        max={max}
        step={step}
        value={value}
      />
    </>
  );
};

export { Default };
