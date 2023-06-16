import { useLoader } from '@react-three/fiber';
import { BackSide, DoubleSide, FrontSide } from 'three';

import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

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
      <mesh>
        <sphereGeometry args={[500]} />
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
      {/* <Stars
        radius={240}
        depth={1}
        count={5000}
        factor={10}
        saturation={0}
        fade
        speed={1}
      /> */}
    </group>
  );
};
