import { makePreOrderTreeTraversalFn } from '@/simulation/systems/keplerTree';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Sphere, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useCallback, useContext, useRef } from 'react';
import { DoubleSide, Object3D, Vector3 } from 'three';
import { ProjectedSphere } from './ProjectedSphere';
import KeplerBody from '@/simulation/classes/kepler-body';
import { EARTH_RADIUS, METER } from '@/simulation/utils/constants';
import { DIST_MULT } from '@/simulation/utils/constants';
import { ObservationSphere } from '../observation-point/ObservationSphere';

const _pos = new Vector3();
const _otherPos = new Vector3();

export const Projector = () => {
  const { keplerTreeActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const root = useSelector(keplerTreeActor, ({ context }) => context.root);
  useSelector(keplerTreeActor, (state) => state.matches('updatingTree'));

  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  const centerRef = useRef<Object3D | null>(null);

  const body = focusTarget instanceof KeplerBody ? focusTarget : null;
  const radius = body ? (body.meanRadius * METER) / 2 : EARTH_RADIUS * METER;
  // const radius = 1e7 * METER;
  return (
    <>
      <group>
        <object3D ref={centerRef}>
          {root
            ? root.orbitingBodies.map((body) => {
                if (body === focusTarget) return;
                return (
                  <ProjectedSphere
                    key={`${body.name}-projected`}
                    body={body}
                    radius={radius}
                  />
                );
              })
            : null}
        </object3D>
        {/* <ObservationSphere radius={radius} /> */}
      </group>
    </>
  );
};
