import { Canvas } from "@react-three/fiber";

const Scene = () => {
  return (
    <div className="h-full w-full border-2 border-red-600">
      <Canvas>
        <perspectiveCamera position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
};

export default Scene;
