import { useFrame } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import { useEffect } from 'react';
import { Vector3 } from 'three';
import { useSnapshot } from 'valtio';
import { camState } from '@/simulation/state/CamState';
import { debugState } from '@/simulation/state/DebugState';
import { selectState } from '@/simulation/state/SelectState';

export const CameraPanel = () => {
  const snap = useSnapshot(camState);
  const [{ position }, set] = useControls('Camera', () => ({
    position: { value: { x: 0, y: 0, z: 0 }, editable: false },
  }));

  useFrame(() => {
    if (snap.controls && snap.controls.camera) {
      const pos = snap.controls.camera.position.clone();
      const targetWorldPos = new Vector3();
      if (camState.focusTarget) {
        camState.focusTarget.getWorldPosition(targetWorldPos);
      }

      pos.subVectors(pos, targetWorldPos);
      // const target = new Vector3();
      // camState.controls.getTarget(target);
      // const diff = target.clone().subVectors(target, targetWorldPos);
      // camState.controls.camera.position.sub(diff);

      set({
        position: {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        },
      });
    }
  });

  return <></>;
};
