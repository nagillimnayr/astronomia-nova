import { ColorRepresentation, Vector3Tuple } from 'three';
import { borderRadius } from '../vr-hud-constants';
import { useFlexSize } from '@react-three/flex';

type VRDividerProps = {
  position?: Vector3Tuple;
  width?: number;
  height?: number;
  color?: ColorRepresentation;
  // borderRadius?: number;
  // borderWidth?: number;
};
export const VRDivider = ({
  position,
  width = 1,
  height = 0.05,
  color,
}: VRDividerProps) => {
  const borderRadius = Math.min(width, height);
  return (
    <>
      <panel
        args={[width, height, borderRadius, 12]}
        position={position}
        backgroundColor={color}
      />
    </>
  );
};

type VRFlexDividerProps = {
  color: ColorRepresentation;
};
export const VRFlexDivider = ({ color }: VRFlexDividerProps) => {
  const [width, height] = useFlexSize();
  return <VRDivider width={width} height={height} color={color} />;
};
