import { Sphere, useTexture } from '@react-three/drei';
import { MaterialNode, extend, useFrame, useLoader } from '@react-three/fiber';
import {
  BackSide,
  DoubleSide,
  FrontSide,
  ShaderMaterial,
  Texture,
  TextureLoader,
} from 'three';

import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { degToRad } from 'three/src/math/MathUtils';
import {
  CelestialSphereMaterialImpl,
  CelestialSphereShaderMaterial,
} from './celestial-sphere-material';
import { useRef } from 'react';

// Extend the shader material.
extend({ CelestialSphereShaderMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      celestialSphereShaderMaterial: CelestialSphereMaterialImpl;
    }
  }
}

type CelestialSphereProps = {
  children: React.ReactNode;
};
export const CelestialSphere = (props: CelestialSphereProps) => {
  const [starmap, hiptyc, milkyway] = useLoader(EXRLoader, [
    'assets/textures/stars/starmap_2020_4k.exr',
    'assets/textures/stars/hiptyc_2020_4k.exr',
    'assets/textures/stars/milkyway_2020_4k.exr',
  ]);
  const [celestialGrid, figures, bounds] = useTexture([
    'assets/textures/stars/celestial_grid_16k.jpg',
    'assets/textures/stars/constellation_figures_8k.jpg',
    'assets/textures/stars/constellation_bounds_8k.jpg',
  ]);

  const materialRef = useRef<ShaderMaterial | null>(null);

  return (
    <group>
      {/** Scale x by -1 to flip uvs */}
      <Sphere args={[1e14, 128, 128]} scale={[-1, 1, 1]}>
        {starmap && celestialGrid && figures ? (
          <celestialSphereShaderMaterial
            ref={materialRef}
            name="celestial-sphere-material"
            starMap={starmap}
            gridMap={celestialGrid}
            figureMap={figures}
            gridOpacity={0.05}
            figureOpacity={0.25}
            side={DoubleSide}
          />
        ) : null}
      </Sphere>
      <group rotation={[-degToRad(90), 0, 0]}>{props.children}</group>
    </group>
  );
};
