import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Object3D } from "three";
import { type ColorRepresentation } from "three/src/math/Color";
import { type Mesh } from "three/src/objects/Mesh";
import { Sphere } from "~/dynamic-imports/Shapes";
import { Trail } from "~/dynamic-imports/Trail";

type SphereProps = {
  color?: ColorRepresentation;
};
const TrailSphere = (props: SphereProps) => {
  const objRef = useRef<Object3D>(null!);

  useFrame(({ clock }, delta) => {
    const timestamp = clock.elapsedTime;
    const sint = Math.sin(timestamp);
    const cost = Math.cos(timestamp);
    objRef.current.rotateX(delta * cost);
    objRef.current.rotateY(delta * sint);
    objRef.current.rotateZ(delta);

    objRef.current.position.setX(cost * 3);
    objRef.current.position.setY(sint * 3);
  });
  return (
    <object3D ref={objRef}>
      <Sphere scale={0.5}>
        <meshStandardMaterial color={props.color ?? "white"} />
      </Sphere>
      <Trail target={objRef} width={0.75} length={10} decay={0.1} />
    </object3D>
  );
};

export default TrailSphere;
