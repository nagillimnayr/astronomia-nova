import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect, useRef } from 'react';
import { type Object3D } from 'three';
import { useSelector } from '@xstate/react';
import { degToRad } from 'three/src/math/MathUtils';

export const VRPlayer = () => {
  const { vrActor } = MachineContext.useSelector(({ context }) => context);
  const objRef = useRef<Object3D>(null!);
  const player = useSelector(vrActor, ({ context }) => context.player);
  useEffect(() => {
    const obj = objRef.current;
    if (!obj || !player) return;
    // Attach object to the player
    player.add(obj);
    obj.position.setY(1);
    obj.rotation.set(0, degToRad(180), 0);
  }, [player]);
  return (
    <object3D ref={objRef}>
      <axesHelper args={[3]} />
    </object3D>
  );
};
