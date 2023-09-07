import { Vector3Tuple } from 'three';
import { VRTimescaleDisplay } from './VRTimescaleDisplay';
import { VRDateDisplay } from './VRDateDisplay';

type VRTimeDisplayProps = {
  position?: Vector3Tuple;
  scale?: number;
};
export const VRTimeDisplay = ({ position, scale }: VRTimeDisplayProps) => {
  return (
    <>
      <group position={position} scale={scale}>
        <VRTimescaleDisplay position={[0, 4, 0]} />
        <VRDateDisplay position={[0, 2, 0]} />
      </group>
    </>
  );
};
