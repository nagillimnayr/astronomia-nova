import React, { useContext } from 'react';
import Body from '../Body/Body';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import { SOLAR_MASS } from '../../utils/constants';
import { useTexture } from '@react-three/drei';
import { CelestialSphere } from '../celestial-sphere/CelestialSphere';
import { Orbit } from '../Orbit/Orbit';
import { SUN_RADIUS } from '@/lib/utils/constants';

export const EarthMoon = () => {
  const [sunTexture, earthTexture, moonTexture] = useTexture([
    'assets/textures/2k_sun.jpg',
    'assets/textures/2k_earth_daymap.jpg',
    'assets/textures/2k_moon.jpg',
  ]);

  const rootRef = useContext(KeplerTreeContext);

  return (
    <Body
      ref={rootRef}
      params={{
        name: 'Sun',
        mass: SOLAR_MASS,
        color: 0xfdee00,
        meanRadius: SUN_RADIUS,
      }}
      texture={sunTexture}
    >
      <Orbit name={'Earth'} texture={earthTexture}>
        <Orbit name={'Moon'} texture={moonTexture}></Orbit>
      </Orbit>
    </Body>
  );
};
