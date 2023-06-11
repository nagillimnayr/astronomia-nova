import { Canvas } from "@react-three/fiber";
import SpinCube from "./SpinCube";
import TrailSphere from "./TrailSphere";
import { OrbitControls } from "~/dynamic-imports/OrbitControls";

const Scene = () => {
  return (
    <Canvas>
      <perspectiveCamera position={[0, 0, 5]}>
        <spotLight />
      </perspectiveCamera>
      <ambientLight intensity={0.1} />
      <SpinCube />
      <TrailSphere />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
