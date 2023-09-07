import { makePreOrderTreeTraversalFn } from '@/simulation/systems/keplerTree';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Sphere, Wireframe } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { Object3D, SphereGeometry, Vector3 } from 'three';
import KeplerBody from '@/simulation/classes/kepler-body';
import { EARTH_RADIUS } from '@/simulation/utils/constants';
import { DIST_MULT } from '@/simulation/utils/constants';
import { VRProjectedTag } from './VRProjectedTag';

const _pos = new Vector3();
const _otherPos = new Vector3();

export const VRTagProjector = () => {
  const { keplerTreeActor, cameraActor, mapActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const root = useSelector(keplerTreeActor, ({ context }) => context.root);
  useSelector(keplerTreeActor, (state) => state.matches('updatingTree'));
  useSelector(mapActor, ({ context }) => context.bodyMap);

  const centerRef = useRef<Object3D | null>(null);
  const sphereGeometry = useMemo(() => {
    const radius = 1;
    const resolution = 32;
    const geometry = new SphereGeometry(radius, resolution, resolution);
    const nonIndexedGeometry = geometry.toNonIndexed(); // Necessary for wireframe.
    geometry.dispose(); // Cleanup original indexed geometry.
    return nonIndexedGeometry;
  }, []);
  return (
    <>
      <object3D ref={centerRef}>
        {root
          ? root.orbitingBodies.map((body) => {
              return (
                <VRProjectedTag
                  key={body.id.toString() + '-projected-tag'}
                  body={body}
                />
              );
            })
          : null}
        <mesh geometry={sphereGeometry} scale={10}>
          <Wireframe
            simplify
            fillOpacity={0}
            colorBackfaces
            fillMix={1}
            stroke={'white'}
            backfaceStroke={'white'}
            thickness={0.01}
          />
        </mesh>
      </object3D>
    </>
  );
};
