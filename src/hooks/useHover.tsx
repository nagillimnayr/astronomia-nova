import { type ThreeEvent } from '@react-three/fiber';
import { type XRInteractionEvent } from '@react-three/xr';
import { useMemo, useState } from 'react';

function useHover() {
  const [isHovered, setHovered] = useState(false);

  const hoverEvents = useMemo(
    () => ({
      handlePointerEnter: (
        event: ThreeEvent<MouseEvent> | XRInteractionEvent
      ) => {
        if ('stopPropagation' in event) {
          event.stopPropagation();
        }
        setHovered(true);
      },
      handlePointerLeave: () => setHovered(false),
    }),
    []
  );

  return { isHovered, setHovered, hoverEvents };
}

export default useHover;
