import { PI, SIMULATION_RADIUS } from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Sphere, useTexture } from '@react-three/drei';
import { extend, useLoader } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useEffect, useRef } from 'react';
import { BackSide, type ShaderMaterial } from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { degToRad } from 'three/src/math/MathUtils';
import {
  CelestialSphereMaterial,
  type CelestialSphereMaterialImpl,
} from './celestial-sphere-material';

// Extend the shader material.
extend({ CelestialSphereMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      celestialSphereMaterial: CelestialSphereMaterialImpl;
    }
  }
}

export const CelestialSphere = () => {
  const [starmap] = useLoader(EXRLoader, [
    'assets/textures/stars/starmap_2020_4k.exr',
  ]);
  // const [celestialGridTexture, constellationTexture] = useTexture([
  //   'assets/textures/stars/celestial_grid_16k.jpg',
  //   'assets/textures/stars/constellation_figures_8k.jpg',
  // ]);
  const [constellationTexture] = useTexture([
    'assets/textures/stars/constellation_figures_8k.jpg',
  ]);

  const materialRef = useRef<ShaderMaterial | null>(null);

  const { celestialSphereActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // const { celestialGrid, constellations } = useSelector(
  //   celestialSphereActor,
  //   ({ context }) => context
  // );
  const { constellations } = useSelector(
    celestialSphereActor,
    ({ context }) => context
  );

  // useEffect(() => {
  //   const subscription = celestialGrid.subscribe(({ context }) => {
  //     if (!materialRef.current) return;
  //     const shader = materialRef.current as CelestialSphereMaterialImpl;
  //     // shader.gridOpacity = context.opacity;
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [celestialGrid]);

  useEffect(() => {
    const subscription = constellations.subscribe(({ context }) => {
      if (!materialRef.current) return;
      const shader = materialRef.current as CelestialSphereMaterialImpl;
      shader.figureOpacity = context.opacity;
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [constellations]);

  return (
    <>
      <object3D rotation-y={PI}>
        {/** Scale x by -1 to flip uvs. */}
        <Sphere
          args={[SIMULATION_RADIUS, 128, 128]}
          scale={[-1, 1, 1]}
          rotation-x={degToRad(23.44)}
        >
          {starmap && constellationTexture ? (
            <celestialSphereMaterial
              key={CelestialSphereMaterial.key}
              ref={materialRef}
              name="celestial-sphere-material"
              starMap={starmap}
              // gridMap={celestialGridTexture}
              figureMap={constellationTexture}
              // gridOpacity={0}
              figureOpacity={0}
              side={BackSide}
            />
          ) : null}
        </Sphere>
      </object3D>
    </>
  );
};
