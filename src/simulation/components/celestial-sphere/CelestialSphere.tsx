import { Sphere, useTexture } from '@react-three/drei';
import { MaterialNode, extend, useFrame, useLoader } from '@react-three/fiber';
import { BackSide, type ShaderMaterial } from 'three';

import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { degToRad } from 'three/src/math/MathUtils';
import {
  type CelestialSphereMaterialImpl,
  CelestialSphereMaterial,
} from './celestial-sphere-material';
import { useContext, useEffect, useRef } from 'react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

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

type CelestialSphereProps = {
  children?: React.ReactNode;
};
export const CelestialSphere = (props: CelestialSphereProps) => {
  const [starmap, hiptyc, milkyway] = useLoader(EXRLoader, [
    'assets/textures/stars/starmap_2020_4k.exr',
    'assets/textures/stars/hiptyc_2020_4k.exr',
    'assets/textures/stars/milkyway_2020_4k.exr',
  ]);
  const [celestialGridTexture, constellationTexture, boundsTexture] =
    useTexture([
      'assets/textures/stars/celestial_grid_16k.jpg',
      'assets/textures/stars/constellation_figures_8k.jpg',
      'assets/textures/stars/constellation_bounds_8k.jpg',
    ]);

  const materialRef = useRef<ShaderMaterial | null>(null);

  const rootStore = useContext(RootStoreContext);
  const rootActor = rootStore.rootMachine;
  const celestialSphereActor = useSelector(
    rootActor,
    ({ context }) => context.celestialSphereActor
  );
  const { celestialGrid, constellations } = useSelector(
    celestialSphereActor,
    ({ context }) => context
  );

  useEffect(() => {
    const subscription = celestialGrid.subscribe(({ context }) => {
      if (!materialRef.current) return;
      const shader = materialRef.current as CelestialSphereMaterialImpl;
      shader.gridOpacity = context.opacity;
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [celestialGrid]);

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
      {/** Scale x by -1 to flip uvs. */}
      <Sphere args={[1e14, 128, 128]} scale={[-1, 1, 1]}>
        {starmap && celestialGridTexture && constellationTexture ? (
          <celestialSphereMaterial
            key={CelestialSphereMaterial.key}
            ref={materialRef}
            name="celestial-sphere-material"
            starMap={starmap}
            gridMap={celestialGridTexture}
            figureMap={constellationTexture}
            gridOpacity={0.05}
            figureOpacity={0.25}
            side={BackSide}
          />
        ) : null}
      </Sphere>
    </>
  );
};
