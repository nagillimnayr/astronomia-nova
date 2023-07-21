import { useLoader } from '@react-three/fiber';
import { BackSide, DoubleSide, FrontSide } from 'three';

import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { degToRad } from 'three/src/math/MathUtils';

type CelestialSphereProps = {
  children: React.ReactNode;
};
export const CelestialSphere = (props: CelestialSphereProps) => {
  const starmap = useLoader(
    EXRLoader,
    'assets/textures/stars/starmap_2020_4k.exr'
  );
  return (
    <group>
      <mesh rotation={[-degToRad(90), 0, 0]}>
        <sphereGeometry args={[100000]} />
        <meshBasicMaterial
          args={[
            {
              map: starmap,
              side: BackSide,
            },
          ]}
        />
        {props.children}
      </mesh>
    </group>
  );
};
