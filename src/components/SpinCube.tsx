import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { type Mesh } from "three";
import { type ColorRepresentation } from "three/src/math/Color";

type CubeProps = {
  color?: ColorRepresentation;
};
const SpinCube = (props: CubeProps) => {
  const meshRef = useRef<Mesh>(null!);

  useFrame(({ clock }, delta) => {
    const timestamp = clock.elapsedTime;
    const sint = Math.sin(timestamp);
    const cost = Math.cos(timestamp);
    meshRef.current.rotateX(delta * cost);
    meshRef.current.rotateY(delta * sint);
    meshRef.current.rotateZ(delta);
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color={props.color ?? "white"} />
    </mesh>
  );
};

export default SpinCube;
