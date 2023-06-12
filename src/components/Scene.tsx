import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '~/drei-imports/controls/OrbitControls';
import Simulation from '~/simulation/components/Simulation';
import { PerspectiveCamera } from '~/drei-imports/cameras/PerspectiveCamera';
import { Stats } from '~/drei-imports/misc/Stats';

const Scene = () => {
  return (
    <Canvas>
      <PerspectiveCamera position={[0, 0, 5]}>
        <spotLight />
      </PerspectiveCamera>
      <ambientLight intensity={0.1} />
      <OrbitControls />
      <Simulation />
      <Stats />
    </Canvas>
  );
};

export default Scene;
