import KeplerBody from '@/simulation/classes/kepler-body';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';

import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { MutableRefObject, useContext, useRef } from 'react';
import { Vector3, type ArrowHelper } from 'three';

const _vel = new Vector3();

type VelocityArrowRefs = {
  bodyRef: MutableRefObject<KeplerBody>;
};
const VelocityArrow = () => {
  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const velocityArrows = useSelector(
    visibilityActor,
    ({ context }) => context.velocityArrows
  );
  const isVisible = useSelector(velocityArrows, (state) =>
    state.matches('active')
  );

  // Get reference to body from context.
  const bodyRef = useContext(KeplerTreeContext);

  // Ref to arrow helper.
  const arrowRef = useRef<ArrowHelper | null>(null);
  useFrame(() => {
    if (!bodyRef || !bodyRef.current) return;

    if (!arrowRef.current) return;

    // Update direction of velocity arrow.
    _vel.copy(bodyRef.current.velocity);
    const lenSq = _vel.lengthSq();
    if (lenSq < 1e-12) {
      arrowRef.current.setLength(lenSq, 0.1, 0.05);
      return;
    }

    const direction = _vel.normalize();
    arrowRef.current.setDirection(direction);
    const length = 2 * (bodyRef.current.meanRadius / DIST_MULT);
    arrowRef.current.setLength(length, 0.1 * length, 0.05 * length);
    // console.log(length);
  });
  return (
    <arrowHelper
      visible={isVisible}
      ref={(arrow) => {
        if (!arrow) return;
        arrowRef.current = arrow;
        arrow.setColor('green');
        if (!bodyRef || !bodyRef.current) {
          console.log('bodyRef invalid');
          return;
        }
        const length = 2 * (bodyRef.current.meanRadius / DIST_MULT);
        arrow.setLength(length, 0.1 * length, 0.05 * length);
      }}
    />
  );
};

export { VelocityArrow };
