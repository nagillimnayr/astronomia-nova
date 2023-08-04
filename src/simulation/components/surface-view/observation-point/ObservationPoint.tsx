import { Sphere, Wireframe } from '@react-three/drei';
import {
  type ReactNode,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Vector3, type Mesh, type Object3D } from 'three';
import { Observer } from '../observer/Observer';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { autorun, reaction } from 'mobx';
import { degToRad } from 'three/src/math/MathUtils';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useActor, useSelector } from '@xstate/react';
import { useKeyPressed } from '@react-hooks-library/core';
import type KeplerBody from '@/simulation/classes/kepler-body';
import { EARTH_RADIUS } from '@/simulation/utils/constants';
import { observer } from 'mobx-react-lite';
import { ObservationSphere } from './ObservationSphere';
import { SkySphere } from '../sky-sphere/SkySphere';

const _up = new Vector3();

type Props = {
  children?: ReactNode;
};
const ObservationPoint = observer(({ children }: Props) => {
  const { cameraService, selectionService } = useContext(GlobalStateContext);
  const focusTarget = useSelector(
    cameraService,
    ({ context }) => context.focusTarget
  );

  const centerRef = useRef<Object3D>(null!);

  const { surfaceCoords } = useContext(RootStoreContext);

  useEffect(() => {
    if (!centerRef.current || !focusTarget) return;
    const body = focusTarget as KeplerBody;
    if (!body || !body.meshRef || !body.meshRef.current) return;
    const mesh = body.meshRef.current;
    // Attach to mesh.
    mesh.add(centerRef.current);
  }, [focusTarget]);

  useEffect(() => {
    // Subscribe to changes to latitude/longitude.
    const unsubCoord = autorun(() => {
      if (!centerRef.current) return;
      // Reset rotation.
      centerRef.current.rotation.set(0, 0, 0);

      // We rotate around the local Y-axis first, as it will initially be the same as the parent's local Z-axis.
      centerRef.current.rotateY(degToRad(surfaceCoords.latitude));
      // We then rotate around the new local Z-axis after the first rotation.
      centerRef.current.rotateZ(degToRad(surfaceCoords.longitude));
    });

    // Cleanup.
    return () => {
      // Unsubscribe.
      unsubCoord();
    };
  }, [surfaceCoords.latitude, surfaceCoords.longitude]);

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
            {/* <axesHelper args={[1.5 * (body.meanRadius / EARTH_RADIUS)]} /> */}
            <group
              name="observation-point"
              position={[body.meanRadius / EARTH_RADIUS + 1e-4, 0, 0]}
              rotation={[0, 0, degToRad(-90)]} // Rotate so that the pole of the sphere is perpendicular to the surface of the body.
            >
              <ObservationSphere />
              <Observer />
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
