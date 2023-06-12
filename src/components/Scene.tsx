import { Canvas } from "@react-three/fiber";
import SpinCube from "./SpinCube";
import TrailSphere from "./TrailSphere";
import { OrbitControls } from "~/drei-imports/controls/OrbitControls";
import Simulation from "~/simulation/components/Simulation";

const Scene = () => {
  return (
    <Canvas>
      <perspectiveCamera position={[0, 0, 5]} fov={50}>
        <spotLight />
      </perspectiveCamera>
      <ambientLight intensity={0.1} />
      {/* <SpinCube />
      <TrailSphere /> */}
      <OrbitControls />
      <Simulation />
    </Canvas>
  );
};

export default Scene;
