import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { BackSide, DoubleSide, FrontSide, TextureLoader } from 'three';

import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { degToRad } from 'three/src/math/MathUtils';

type CelestialSphereProps = {
  children: React.ReactNode;
};
export const CelestialSphere = (props: CelestialSphereProps) => {
  const [starmap, hiptyc, milkyway] = useLoader(EXRLoader, [
    'assets/textures/stars/starmap_2020_4k.exr',
    'assets/textures/stars/hiptyc_2020_4k.exr',
    'assets/textures/stars/milkyway_2020_4k.exr',
  ]);
  const [celestialGrid] = useTexture([
    'assets/textures/stars/celestial_grid_16k.jpg',
    'assets/textures/stars/constellation_figures_8k.jpg',
    'assets/textures/stars/constellation_bounds_8k.jpg',
  ]);
  return (
    <group>
      <mesh rotation={[-degToRad(90), 0, 0]}>
        <sphereGeometry args={[1e14]} />
        <meshBasicMaterial
          name="celestial-sphere-material"
          map={starmap}
          side={BackSide}
        />
        {props.children}
      </mesh>
    </group>
  );
};
