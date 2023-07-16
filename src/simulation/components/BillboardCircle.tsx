import { Html } from '@react-three/drei';

/** I don't know what to call this, but its the circle around the bodies to identify their positions when zoomed out really far */

export function BillboardCircle() {
  return (
    <object3D>
      <Html
        center
        className="aspect-square w-4 cursor-pointer rounded-full border-2 border-white bg-transparent hover:w-6"
      />
    </object3D>
  );
}
