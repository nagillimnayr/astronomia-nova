import { Canvas } from "@react-three/fiber";

const Scene = () => {
  return (
    <Canvas>
      <perspectiveCamera position={[0, 0, 5]}>
        <spotLight />
      </perspectiveCamera>
      <ambientLight intensity={0.1} />
    </Canvas>
  );
};

export default Scene;
