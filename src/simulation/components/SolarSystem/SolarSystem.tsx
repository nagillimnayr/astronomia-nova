import React, { PropsWithChildren, useEffect, useRef } from 'react';
import Body from '../Body/Body';
import type KeplerBody from '../../classes/kepler-body';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import { CelestialSphere } from '@/simulation/components/celestial-sphere/CelestialSphere';
import {
  Selection,
  EffectComposer,
  Outline,
} from '@react-three/postprocessing';
import { useSimStore } from '@/simulation/state/zustand/sim-store';

export type UpdateFn = (deltaTime: number) => void;

type Props = PropsWithChildren;
const SolarSystem = ({ children }: Props) => {
  // Use ref to store root of tree.
  const rootRef = useRef<KeplerBody>(null!);

  // Set root of tree in external store.
  useEffect(() => {
    // This should only run on mount.
    console.log('Passing rootRef to external store');
    useSimStore.setState({ rootRef: rootRef });
  }, []);

  return (
    <KeplerTreeContext.Provider value={rootRef}>
      <Selection>
        <EffectComposer autoClear={false} multisampling={8}>
          <Outline
            blur
            edgeStrength={100}
            visibleEdgeColor={0xffffff}
            width={1000}
          />
        </EffectComposer>
        <CelestialSphere>{children}</CelestialSphere>
      </Selection>
    </KeplerTreeContext.Provider>
  );
};

export default SolarSystem;
