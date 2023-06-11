import { type ColorRepresentation } from "three/src/math/Color";

type CubeProps = {
  color?: ColorRepresentation;
};
const SpinCube = (props: CubeProps) => {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color={props.color ?? "white"} />
    </mesh>
  );
};

export default SpinCube;
