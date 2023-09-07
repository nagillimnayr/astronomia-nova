import { anim } from '@/components/canvas/animated-components';
import type KeplerBody from '@/components/canvas/body/kepler-body';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSpring } from '@react-spring/three';
import { useSelector } from '@xstate/react';
import {
  forwardRef,
  type MutableRefObject,
  type PropsWithChildren,
} from 'react';
import { type ColorRepresentation, DoubleSide, type Mesh } from 'three';

type CircleMarkerProps = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
  color: ColorRepresentation;
};
export const CircleMarker = forwardRef<Mesh, CircleMarkerProps>(
  function CircleMarker({ bodyRef, color }: CircleMarkerProps, fwdRef) {
    const { cameraActor, visibilityActor } = MachineContext.useSelector(
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

    const spring = useSpring({
      opacity: markersEnabled ? 1 : 0,
    });

    return (
      <>
        <anim.Circle
          ref={fwdRef}
          // visible={markersEnabled}
          material-color={color}
          material-side={DoubleSide}
          material-transparent={true}
          material-opacity={spring.opacity}
        />
      </>
    );
  }
);
