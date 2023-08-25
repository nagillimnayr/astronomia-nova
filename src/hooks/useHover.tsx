import { useMemo, useState } from 'react';

function useHover() {
  const [isHovered, setHovered] = useState(false);

  const hoverEvents = useMemo(
    () => ({
      onPointerEnter: () => setHovered(true),
      onPointerLeave: () => setHovered(false),
    }),
    []
  );

  return { isHovered, setHovered, hoverEvents };
}

export default useHover;
