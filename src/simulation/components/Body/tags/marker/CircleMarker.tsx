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
    const onSurface = useSelector(cameraActor, (state) =>
      state.matches('surface')
    );
    const markers = useSelector(
      visibilityActor,
      ({ context }) => context.markers
    );
    const markersEnabled = useSelector(markers, (state) =>
      state.matches('active')
    );

    const materialRef = useRef<MeshBasicMaterial>(null!);

    return (
      <>
        <Circle ref={fwdRef} args={[1]} visible={markersEnabled}>
          <meshBasicMaterial
            ref={materialRef}
            side={DoubleSide}
            color={color}
          />
        </Circle>
      </>
    );
  }
);
