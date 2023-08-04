import { makePreOrderTreeTraversalFn } from '@/simulation/systems/keplerTree';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useCallback, useContext, useRef } from 'react';
import { Object3D, Vector3 } from 'three';
import { ProjectedSphere } from './ProjectedSphere';
import KeplerBody from '@/simulation/classes/kepler-body';
import { EARTH_RADIUS } from '@/lib/utils/constants';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

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

  useFrame(() => {
    if (!centerRef.current || !focusTarget) return;
    focusTarget.getWorldPosition(_pos);
    centerRef.current.position.copy(_pos);
  });

  if (!focusTarget) return;

  const body = focusTarget instanceof KeplerBody ? focusTarget : null;
  if (!body) return;
  const radius = (5 * body.meanRadius) / EARTH_RADIUS;
  return (
    <>
      <object3D ref={centerRef}>
        {root
          ? root.orbitingBodies.map((body) => {
              if (body === focusTarget) return;
              return (
                <ProjectedSphere
                  key={body.id.toString() + '-projected'}
                  body={body}
                  radius={radius}
                />
              );
            })
          : null}
      </object3D>
    </>
  );
};
