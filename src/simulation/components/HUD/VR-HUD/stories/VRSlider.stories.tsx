import type { Meta, StoryObj } from '@storybook/react';
import { VRCanvasDecorator } from '@/stories/decorators/VRCanvasDecorator';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { VRSlider } from '../vr-ui-components/VRSlider';
import { colors } from '../vr-hud-constants';
import { useMemo, useRef, useState } from 'react';
import { Object3D, Spherical } from 'three';
import { useEventListener } from '@react-hooks-library/core';
import { useFrame, useThree } from '@react-three/fiber';
import { clamp, degToRad } from 'three/src/math/MathUtils';
import { PI, PI_OVER_TWO } from '@/simulation/utils/constants';

const meta: Meta<typeof VRSlider> = {
  title: 'VR-UI/components/VRSlider',
  component: VRSlider,
  decorators: [(storyFn) => <VRCanvasDecorator>{storyFn()}</VRCanvasDecorator>],
  argTypes: {
    value: {
      control: { type: 'range', min: -100, max: 100, step: 0.1 },
    },
    trackColor: { control: { type: 'color' } },
    rangeColor: { control: { type: 'color' } },
    thumbColor: { control: { type: 'color' } },
    thumbBorderColor: { control: { type: 'color' } },
  },
};

export default meta;
type Story = StoryObj<typeof VRSlider>;

const Default: Story = {
  args: {
    position: [0, 0, 0],
    height: 0.1,
    width: 2,
    value: 0,
    thumbRadius: 0.1,
    trackColor: 'black',
    rangeColor: 'white',
    thumbColor: 'white',
    thumbBorderColor: colors.border,
  },
  render: (args) => {
    return (
      <>
        <KeyboardCamControls />
        <VRSlider {...args} min={-100} max={100} step={0.1} />
      </>
    );
  },
};

export { Default };

const rotateSpeed = 1;
const MIN_POLAR = 0;
const MAX_POLAR = PI;

const KeyboardCamControls = () => {
  const pivotRef = useRef<Object3D>(null!);
  const sph = useMemo(() => new Spherical(1, PI_OVER_TWO), []);
  const [spherical, setSpherical] = useState<Spherical>(sph);
  const getThree = useThree(({ get }) => get);
  useEventListener('keypress', (event) => {
    // console.log(event.key);
    switch (event.key) {
      case '8': {
        spherical.phi = clamp(
          spherical.phi + degToRad(rotateSpeed),
          MIN_POLAR,
          MAX_POLAR
        );
        break;
      }
      case '2': {
        spherical.phi = clamp(
          spherical.phi - degToRad(rotateSpeed),
          MIN_POLAR,
          MAX_POLAR
        );
        break;
      }
      case '4': {
        spherical.theta -= degToRad(rotateSpeed);
        break;
      }
      case '6': {
        spherical.theta += degToRad(rotateSpeed);
        break;
      }
    }
  });

  useFrame((state, delta) => {
    const pivot = pivotRef.current;
    const { camera, invalidate } = state;
    pivot.rotation.set(0, 0, 0);
    pivot.add(camera);
    camera.position.set(0, 0, spherical.radius);
    spherical.makeSafe();
    pivot.rotateY(spherical.theta);

    const polar = PI_OVER_TWO - spherical.phi;
    pivot.rotateX(polar);
    invalidate();
  });

  return (
    <>
      <object3D
        ref={(obj) => {
          if (!obj) return;
          pivotRef.current = obj;
          const { camera } = getThree();
          obj.add(camera);
          camera.position.set(0, 0, spherical.radius);
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 1]} />
      </object3D>
    </>
  );
};
