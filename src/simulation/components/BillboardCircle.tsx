import { Html } from '@react-three/drei';

/** I don't know what to call this, but its the circle around the bodies to identify their positions when zoomed out really far */

export function BillboardCircle() {
  return (
    <Html
      center
      className="aspect-square w-24 cursor-pointer border-2 border-white bg-transparent"
    />
  );
}
