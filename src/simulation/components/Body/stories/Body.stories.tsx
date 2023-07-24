import type { Meta, StoryObj } from '@storybook/react';
import { CanvasDecorator } from '@/stories/decorators/CanvasDecorator';
import Body from '../Body';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { Grid, useTexture } from '@react-three/drei';
import { degToRad } from 'three/src/math/MathUtils';

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
      <Body
        params={{
          name: 'body',
          color: 'white',
          mass: 0,
          meanRadius: 0.5,
          initialPosition: [0, 0.5 * DIST_MULT, 0],
          initialVelocity: [0, 0, 0],
        }}
      />
      <Grid infiniteGrid />
    </>
  );
};

const EarthStory = () => {
  const earthTexture = useTexture('assets/textures/2k_earth_daymap.jpg');
  return (
    <>
      <object3D rotation={[degToRad(-90), 0, 0]} position={[0, 0.5, 0]}>
        <Body
          params={{
            name: 'body',
            color: 'white',
            mass: 0,
            meanRadius: 0.5,
            initialPosition: [0, 0, 0],
            initialVelocity: [0, 0, 0],
          }}
          texture={earthTexture}
        />
      </object3D>
      <Grid infiniteGrid />
    </>
  );
};
export const Earth = () => {
  return <EarthStory />;
};
