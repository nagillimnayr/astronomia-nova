import { Canvas } from "@react-three/fiber";

const Scene = () => {
  return (
    <Canvas>
      <perspectiveCamera position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
    </Canvas>
  );
};

export default Scene;
