import { type ReactNode, useEffect, useRef } from 'react';
import { type Object3D } from 'three';
import { Observer } from '../observer/Observer';

import { degToRad } from 'three/src/math/MathUtils';
// import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import KeplerBody from '@/simulation/classes/kepler-body';
import { DIST_MULT } from '@/simulation/utils/constants';
import { observer } from 'mobx-react-lite';
import { ObservationSphere } from './ObservationSphere';
import { SkySphere } from '../sky-sphere/SkySphere';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Compass } from '../compass/Compass';
import { Sphere } from '@react-three/drei';

type Props = {
  children?: ReactNode;
};
const ObservationPoint = observer(({ children }: Props) => {
  const { cameraActor, surfaceActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  const centerRef = useRef<Object3D>(null!);

  // Attach the observation point to the mesh of the focused body.
  useEffect(() => {
    if (
      !centerRef.current ||
      !focusTarget ||
      !(focusTarget instanceof KeplerBody)
    )
      return;
    const body = focusTarget;
    if (!body || !body.meshRef || !body.meshRef.current) return;
    const mesh = body.meshRef.current;
    // Attach to mesh.
    mesh.add(centerRef.current);
  }, [focusTarget]);

  useEffect(() => {
    // Subscribe to changes to latitude/longitude.
    const subscription = surfaceActor.subscribe(({ context }) => {
      if (!centerRef.current) return;
      const { latitude, longitude } = context;
      // Reset rotation.
      centerRef.current.rotation.set(0, 0, 0);

      // We rotate around the local Y-axis first, as it will initially be the same as the parent's local Z-axis.
      centerRef.current.rotateY(degToRad(latitude));
      // We then rotate around the new local Z-axis after the first rotation.
      centerRef.current.rotateZ(degToRad(longitude));
    });

    // Cleanup.
    return () => {
      // Unsubscribe.
      subscription.unsubscribe();
    };
  }, [surfaceActor]);

  const body = focusTarget as KeplerBody;
  if (!body) return;
  const meshRef = body.meshRef;
  if (!meshRef || !meshRef.current) return;
  const mesh = meshRef.current;
  return (
    <>
      {body && mesh ? (
        <>
          <object3D ref={centerRef}>
            {/* <axesHelper args={[1.5 * (body.meanRadius / DIST_MULT)]} /> */}

            {/** Attach group at a distance so that it is on the surface of the body. */}
            <group
              name="observation-point"
              position={[body.meanRadius / DIST_MULT, 0, 0]}
              rotation={[0, 0, degToRad(-90)]} // Rotate so that the pole of the sphere is perpendicular to the surface of the body.
            >
              {/* <axesHelper args={[1e-2]} /> */}
              <ObservationSphere />
              <Observer />
              <Compass />
              {children}
            </group>
          </object3D>

          <SkySphere />
        </>
      ) : null}
    </>
  );
});

export { ObservationPoint };
