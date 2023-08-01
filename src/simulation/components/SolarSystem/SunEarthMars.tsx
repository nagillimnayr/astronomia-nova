import Body from '../Body/Body';
import type KeplerBody from '../../classes/kepler-body';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import { SOLAR_MASS } from '../../utils/constants';
import { useTexture } from '@react-three/drei';
import { CelestialSphere } from '../celestial-sphere/CelestialSphere';
import { Orbit } from '../Orbit/Orbit';
import { RetrogradeContext } from '../Retrograde/RetrogradeContext';
import { useContext } from 'react';
import { SUN_RADIUS } from '@/lib/utils/constants';

export const SunEarthMars = () => {
  const [sunTexture, earthTexture, marsTexture] = useTexture([
    'assets/textures/2k_sun.jpg',
    'assets/textures/2k_earth_daymap.jpg',
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
      <RetrogradeContext.Provider value={'referenceBody'}>
        <Orbit name={'Earth'} texture={earthTexture}></Orbit>
      </RetrogradeContext.Provider>
      <RetrogradeContext.Provider value={'otherBody'}>
        <Orbit name={'Mars'} texture={marsTexture}></Orbit>
      </RetrogradeContext.Provider>
    </Body>
  );
};
