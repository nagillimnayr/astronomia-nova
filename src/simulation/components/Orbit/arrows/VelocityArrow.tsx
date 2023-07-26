import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { EARTH_RADIUS } from '@/simulation/utils/constants';
import { VelArrowContext } from '@/state/xstate/toggle-machine/ToggleMachineProviders';
import { useFrame } from '@react-three/fiber';
import { useActor } from '@xstate/react';
import { useContext, useRef } from 'react';
import { type ArrowHelper } from 'three';

const VelocityArrow = () => {
  const actor = useContext(VelArrowContext);
  const [state] = useActor(actor);
  const isActive = state.matches('active');

  // Get reference to body from context.
  const bodyRef = useContext(KeplerTreeContext);

  // Ref to arrow helper.
  const arrowRef = useRef<ArrowHelper | null>(null);
  useFrame(() => {
    if (!bodyRef || !bodyRef.current) return;

    if (!arrowRef.current) return;
    // Update direction of velocity arrow.
    const direction = bodyRef.current.velocity.clone().normalize();
    arrowRef.current.setDirection(direction);
  });
  return (
    <arrowHelper
      visible={isActive}
      ref={(arrow) => {
        if (!arrow) return;
        arrowRef.current = arrow;
        arrow.setColor('green');
        if (!bodyRef || !bodyRef.current) return;
        arrow.setLength(1.5 * bodyRef.current.meanRadius, 0.2, 0.05);
      }}
    />
  );
};

export { VelocityArrow };
