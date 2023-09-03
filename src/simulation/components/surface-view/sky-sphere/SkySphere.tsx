import KeplerBody from '@/simulation/classes/kepler-body';
import {
  DIST_MULT,
  EARTH_RADIUS,
  METER,
  PI,
  PI_OVER_TWO,
  TWO_PI,
} from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Edges, Sphere, Wireframe, useTexture } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DoubleSide, Mesh, Object3D, Texture } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

export const SkySphere = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );
  const [isVisible, setVisible] = useState(false);
  const sphereRef = useRef<Mesh | null>(null);
  const centerRef = useRef<Object3D | null>(null);
  const textureRef = useRef<Texture>(null!);
  const gridTexture = useTexture(
    'assets/textures/stars/celestial_grid_16k.jpg',
    (texture) => {
      if (Array.isArray(texture)) return;
      textureRef.current = texture;
    }
  );

  const sphereArgs: [number, number, number] = useMemo(() => {
    const radius = 1;
    const resolution = 64;

    return [radius, resolution, resolution];
  }, []);

  const body = focusTarget instanceof KeplerBody ? focusTarget : null;
  const radius = body ? body.meanRadius * METER : EARTH_RADIUS * METER;
  return (
    <>
      <object3D ref={centerRef} scale={radius} position-y={-3e4}>
        <Suspense>
          <Sphere
            ref={sphereRef}
            scale-x={-1}
            scale-y={1}
            scale-z={1}
            args={sphereArgs}
          >
            <meshBasicMaterial
              transparent
              alphaMap={textureRef.current}
              side={DoubleSide}
            />
          </Sphere>
        </Suspense>
      </object3D>
    </>
  );
};
