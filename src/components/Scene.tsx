import { Canvas } from "@react-three/fiber";
import SpinCube from "./SpinCube";

const Scene = () => {
  return (
    <Canvas>
      <perspectiveCamera position={[0, 0, 5]}>
        <spotLight />
      </perspectiveCamera>
      <ambientLight intensity={0.1} />
      <SpinCube />
    </Canvas>
  );
};

export default Scene;
