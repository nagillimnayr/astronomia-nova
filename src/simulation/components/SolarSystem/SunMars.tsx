import React, { useContext } from 'react';
import Body from '../Body/Body';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import { SOLAR_MASS } from '../../utils/constants';
import { useTexture } from '@react-three/drei';
import { Orbit } from '../Orbit/Orbit';
import { SUN_RADIUS } from '@/lib/utils/constants';

export const SunMars = () => {
  const [sunTexture, marsTexture] = useTexture([
    'assets/textures/2k_sun.jpg',
    'assets/textures/2k_mars.jpg',
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
      <Orbit name={'Mars'} texture={marsTexture}></Orbit>
    </Body>
  );
};
