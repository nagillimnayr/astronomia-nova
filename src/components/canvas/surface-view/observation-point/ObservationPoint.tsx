import { KeplerBody } from '@/components/canvas/body/kepler-body';
import { DEG_TO_RADS, METER, PI_OVER_TWO } from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { type ReactNode, useEffect, useRef } from 'react';
import { type Object3D } from 'three';
import { Compass } from '../compass/Compass';
import { Observer } from '../observer/Observer';
import { ObservationPointIndicator } from './ObservationPointIndicator';

const METERS_ABOVE_SURFACE = 100;

type Props = {
  children?: ReactNode;
};
const ObservationPoint = ({ children }: Props) => {
  const { cameraActor, surfaceActor, uiActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );
  const surfaceDialogActor = useSelector(
    uiActor,
    ({ context }) => context.surfaceDialogActor
  );
  const vrSurfaceDialogActor = useSelector(
    uiActor,
    ({ context }) => context.vrSurfaceDialogActor
  );
  // Check if surface dialog is open.
  const dialogOpen = useSelector(surfaceDialogActor, (state) =>
    state.matches('open')
  );
  const vrDialogOpen = useSelector(vrSurfaceDialogActor, (state) =>
    state.matches('active')
  );

  // Check if in surface view.
  const onSurface = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );

  const isVisible = onSurface || dialogOpen || vrDialogOpen;

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

      // Rotate around the local Y-axis first, which will be the polar axis of
      // the body..
      centerRef.current.rotateY(longitude * DEG_TO_RADS);
      // We then rotate around the new local Z-axis after the first rotation.
      centerRef.current.rotateZ(latitude * DEG_TO_RADS);
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
          {/** Pivot point at center of body. */}
          <object3D ref={centerRef} visible={isVisible}>
            {/* <axesHelper args={[2 * (body.meanRadius / DIST_MULT)]} /> */}
            {/** Attach group at a distance so that it is on the surface of the body. */}
            <group
              name="observation-point"
              position={[
                (body.meanRadius + METERS_ABOVE_SURFACE) * METER,
                0,
                0,
              ]} // Position on surface.
              rotation={[0, 0, -PI_OVER_TWO]} // Rotate so that the pole of the
              // sphere is perpendicular to the
              // surface of the body.
            >
              {/* <axesHelper args={[1e-2]} /> */}
              {/* <ObservationSphere /> */}
              <ObservationPointIndicator />
              <Observer />
              <Compass />
              {children}
            </group>
          </object3D>

          {/* <SkySphere /> */}
        </>
      ) : null}
    </>
  );
};

export { ObservationPoint };
