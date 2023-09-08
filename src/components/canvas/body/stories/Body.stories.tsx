import { DIST_MULT } from '@/constants/constants';
import { CanvasDecorator } from '@/stories/decorators/CanvasDecorator';
import { Grid, useTexture } from '@react-three/drei';
import type { Meta, StoryObj } from '@storybook/react';
import { degToRad } from 'three/src/math/MathUtils';
import { Body } from '../Body';

const meta: Meta<typeof Body> = {
  title: 'KeplerBody/Body',
  component: Body,
  decorators: [(storyFn) => <CanvasDecorator>{storyFn()}</CanvasDecorator>],
};
export default meta;
type Story = StoryObj<typeof Body>;

export const NoTexture = () => {
  return (
    <>
      <object3D rotation={[degToRad(-90), 0, 0]}>
        <Body
          name={'Earth'}
          color={'white'}
          mass={0}
          meanRadius={0.5}
          initialPosition={[0, 0, 0]}
          initialVelocity={[0, 0, 0]}
        />
      </object3D>
      <Grid infiniteGrid position={[0, -0.5, 0]} />
    </>
  );
};

const EarthStory = () => {
  const earthTexture = useTexture('assets/textures/2k_earth_daymap.jpg');
  return (
    <>
      <object3D rotation={[degToRad(-90), 0, 0]}>
        <Body
          name={'Earth'}
          color={'white'}
          mass={0}
          meanRadius={0.5}
          initialPosition={[0, 0, 0]}
          initialVelocity={[0, 0, 0]}
          texture={earthTexture}
        />
      </object3D>
      <Grid infiniteGrid position={[0, -0.5, 0]} />
    </>
  );
};
export const Earth = () => {
  return <EarthStory />;
};
