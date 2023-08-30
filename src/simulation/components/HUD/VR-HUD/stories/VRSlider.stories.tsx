import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { CameraControls, PerspectiveCamera, Text } from '@react-three/drei';
import {
  VRSlider,
  VRSliderProps,
} from '../vr-ui-components/vr-slider/VRSlider';
import { colors } from '../vr-hud-constants';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Object3D, Spherical, Vector3Tuple } from 'three';
import { useEventListener } from '@react-hooks-library/core';
import { useFrame, useThree } from '@react-three/fiber';
import { clamp, degToRad } from 'three/src/math/MathUtils';
import { PI, PI_OVER_TWO } from '@/simulation/utils/constants';
import { KeyboardCamControls } from '@/simulation/components/camera-controller/KeyboardCamControls';

const meta: Meta<typeof VRSlider> = {
  title: 'VR-UI/components/VRSlider',
  component: VRSlider,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
  argTypes: {
    value: {
      control: { type: 'range', min: -100, max: 100, step: 1 },
    },
    min: {
      control: { type: 'range', min: -100, max: 0, step: 1 },
    },
    max: {
      control: { type: 'range', min: 1, max: 100, step: 1 },
    },
    width: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.01 },
    },
    height: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.01 },
    },
    thumbRadius: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.01 },
    },
    trackColor: { control: { type: 'color' } },
    fillColor: { control: { type: 'color' } },
    thumbColor: { control: { type: 'color' } },
    thumbBorderColor: { control: { type: 'color' } },
  },
};

export default meta;
type Story = StoryObj<typeof VRSlider>;

const Default: Story = {
  args: {
    position: [0, -0.15, 0],
    height: 0.1,
    width: 2,
    value: 0,
    min: -100,
    max: 100,
    step: 2,
    thumbRadius: 0.1,
    trackColor: 'black',
    fillColor: 'white',
    thumbColor: 'white',
    thumbBorderColor: colors.border,
  },
  render: (args) => {
    return (
      <>
        <VRSliderStory {...args} />
      </>
    );
  },
};

const VRSliderStory = ({ ...args }: VRSliderProps) => {
  const [val, setVal] = useState<number>(args.value);
  const handleValueChange = useCallback((value: number) => {
    setVal(value);
  }, []);
  return (
    <>
      <CameraControls makeDefault />
      <Text position={[0, 0.15, 0]} fontSize={0.35}>
        {val.toLocaleString()}
      </Text>
      <VRSlider {...args} onValueChange={handleValueChange} />
    </>
  );
};

export { Default };
