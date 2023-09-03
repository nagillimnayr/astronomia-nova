import { Circle } from '@react-three/drei';
import type KeplerBody from '@/simulation/classes/kepler-body';
import {
  type MutableRefObject,
  useRef,
  type PropsWithChildren,
  forwardRef,
} from 'react';
import {
  type Mesh,
  type MeshBasicMaterial,
  DoubleSide,
  type ColorRepresentation,
} from 'three';

import { useActor, useSelector } from '@xstate/react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { SpringValue, useSpring, animated } from '@react-spring/three';
import { anim } from '@/simulation/components/animated-components';
import { EARTH_RADIUS } from '@/simulation/utils/constants';

type SphereMarkerProps = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
  color?: ColorRepresentation;
};
export const SphereMarker = forwardRef<Mesh, SphereMarkerProps>(
  function SphereMarker({ bodyRef, color }: SphereMarkerProps, fwdRef) {
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
        <object3D>
          <anim.Sphere
            ref={fwdRef}
            // visible={markersEnabled}
            material-color={color}
            material-transparent={true}
            material-opacity={spring.opacity}
          />
        </object3D>
      </>
    );
  }
);
