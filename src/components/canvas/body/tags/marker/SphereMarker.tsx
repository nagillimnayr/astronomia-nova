import { anim } from '@/components/canvas/animated-components';
import { type KeplerBody } from '@/components/canvas/body/kepler-body';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { animated, useSpring } from '@react-spring/three';
import { useSelector } from '@xstate/react';
import {
  forwardRef,
  type MutableRefObject,
  type PropsWithChildren,
} from 'react';
import { type ColorRepresentation, type Mesh } from 'three';

type SphereMarkerProps = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
  color?: ColorRepresentation;
};
export const SphereMarker = forwardRef<Mesh, SphereMarkerProps>(
  function SphereMarker({ bodyRef, color }: SphereMarkerProps, fwdRef) {
    const { visibilityActor } = MachineContext.useSelector(
      ({ context }) => context
    );

    // Check if marker visibility is enabled.
    const markers = useSelector(
      visibilityActor,
      ({ context }) => context.markers
    );
    const markersEnabled = useSelector(markers, (state) =>
      state.matches('active')
    );

    const scale = 0.75;
    const spring = useSpring({
      opacity: markersEnabled ? 1 : 0,
      scale: markersEnabled ? scale : 0,
    });

    return (
      <>
        <animated.object3D scale={spring.scale}>
          <anim.Sphere ref={fwdRef} material-color={color} />
        </animated.object3D>
      </>
    );
  }
);
