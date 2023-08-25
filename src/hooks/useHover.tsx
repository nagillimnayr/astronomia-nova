import { useMemo, useState } from 'react';

function useHover() {
  const [isHovered, setHovered] = useState(false);

  const hoverEvents = useMemo(
    () => ({
      handlePointerEnter: () => setHovered(true),
      handlePointerLeave: () => setHovered(false),
    }),
    []
  );

  return { isHovered, setHovered, hoverEvents };
}

export default useHover;
