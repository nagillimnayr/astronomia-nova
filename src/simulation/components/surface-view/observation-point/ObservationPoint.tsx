import { Sphere, Wireframe } from '@react-three/drei';
import {
  type ReactNode,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { Vector3, type Mesh, type Object3D } from 'three';
import { Observer } from '../observer/Observer';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { autorun, reaction } from 'mobx';
import { degToRad } from 'three/src/math/MathUtils';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useActor, useSelector } from '@xstate/react';
import { useKeyPressed } from '@react-hooks-library/core';
import KeplerBody from '@/simulation/classes/KeplerBody';
import { EARTH_RADIUS } from '@/simulation/utils/constants';

const _up = new Vector3();

type Props = {
  children?: ReactNode;
};
const ObservationPoint = ({ children }: Props) => {
  const { cameraService } = useContext(GlobalStateContext);
  const focusTarget = useSelector(
    cameraService,
    (state) => state.context.focus
  );

  const centerRef = useRef<Object3D>(null!);
  const sphereRef = useRef<Mesh>(null!);

  const { surfaceState, uiState } = useContext(RootStoreContext);

  useEffect(() => {
    if (!centerRef.current || !focusTarget) return;
    console.log('focusTarg:', focusTarget);
    focusTarget.add(centerRef.current);
  }, [focusTarget]);

  useEffect(() => {
    // Subscribe to changes to latitude/longitude.
    const unsubCoord = autorun(() => {
      if (!centerRef.current) return;
      // Reset rotation.
      centerRef.current.rotation.set(0, 0, 0);

      // We rotate around the local Z-axis first, as it will initially be the same as the parent's local Z-axis.
      centerRef.current.rotateZ(degToRad(surfaceState.longitude));
      // We then rotate around the new local Y-axis after the first rotation.
      centerRef.current.rotateY(-degToRad(surfaceState.latitude));
    });

    // Cleanup.
    return () => {
      // Unsubscribe.
      unsubCoord();
    };
  }, [surfaceState.latitude, surfaceState.longitude, uiState.selected]);

  useKeyPressed(' ', (event) => {
    event.preventDefault();
    console.log('focusTarget:', focusTarget);
    if (!centerRef.current) return;
    console.log('parent:', centerRef.current.parent);
  });
  const body = focusTarget as KeplerBody;
  return (
    <>
      {body ? (
        <object3D ref={centerRef}>
          <axesHelper args={[1.5 * (body.meanRadius / EARTH_RADIUS)]} />
          <Sphere
            // visible={false}
            ref={sphereRef}
            args={[1e-2]}
            position={[body.meanRadius / EARTH_RADIUS, 0, 0]}
          >
            <Wireframe
              simplify
              stroke="white"
              squeeze
              fillMix={1}
              fillOpacity={0.2}
            />
            <Observer />
            {children}
          </Sphere>
        </object3D>
      ) : null}
    </>
  );
};

export { ObservationPoint };
