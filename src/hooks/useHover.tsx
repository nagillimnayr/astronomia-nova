import { useMemo, useState } from 'react';

function useHover() {
  const [isHovered, setHovered] = useState(false);

  const hoverProps = useMemo(
    () => ({
      onPointerEnter: () => setHovered(true),
      onPointerLeave: () => setHovered(false),
    }),
    []
  );

  return { isHovered, setHovered, hoverProps };
}

export default useHover;
