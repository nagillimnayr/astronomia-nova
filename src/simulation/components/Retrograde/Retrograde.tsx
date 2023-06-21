import { MeshLineGeometry, Trail } from '@react-three/drei';
import { useRef } from 'react';
import { useSnapshot } from 'valtio';
import { retrogradeState } from './retrogradeState';
import { Object3D } from 'three';

export const Retrograde = () => {
  const objRef = useRef<Object3D>(null!);
  const trailRef = useRef<MeshLineGeometry>(null!);

  const snap = useSnapshot(retrogradeState);

  return (
    <>
      <object3D ref={objRef}>
        <Trail ref={trailRef} />
      </object3D>
    </>
  );
};
