import { Billboard, Circle, Html, Ring, useCursor } from '@react-three/drei';
import type KeplerBody from '@/simulation/classes/kepler-body';
import {
  useCallback,
  type MutableRefObject,
  useContext,
  type MouseEventHandler,
  useRef,
  type PropsWithChildren,
  useState,
  forwardRef,
} from 'react';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import {
  type Mesh,
  type MeshBasicMaterial,
  Vector3,
  DoubleSide,
  PerspectiveCamera,
  type ColorRepresentation,
} from 'three';

import { useActor, useSelector } from '@xstate/react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Interactive, XRInteractionEvent } from '@react-three/xr';

type CircleMarkerProps = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
  color: ColorRepresentation;
};
export const CircleMarker = forwardRef<Mesh, CircleMarkerProps>(
  function CircleMarker({ bodyRef, color }: CircleMarkerProps, fwdRef) {
    const { selectionActor, cameraActor } = MachineContext.useSelector(
      ({ context }) => context
    );

    // Check if marker visibility is on.
    const isVisible = useSelector(cameraActor, (state) =>
      state.matches('surface')
    );

    const circleRef = useRef<Mesh>(null!);
    const materialRef = useRef<MeshBasicMaterial>(null!);

    // const [isHovered, setHovered] = useState<boolean>(false);
    // useCursor(isHovered, 'pointer');

    // const handleSelect = useCallback(() => {
    //   const body = bodyRef.current;
    //   selectionActor.send({ type: 'SELECT', selection: body });
    // }, [bodyRef, selectionActor]);

    // const handleClick = useCallback(
    //   (event: ThreeEvent<MouseEvent>) => {
    //     event.stopPropagation();
    //     handleSelect();
    //   },
    //   [handleSelect]
    // );

    return (
      <>
        {/* <Interactive onSelect={handleSelect}> */}
        <Circle
          ref={fwdRef}
          args={[1]}
          // visible={isVisible}
          // onClick={handleClick}
          // onPointerEnter={() => setHovered(true)}
          // onPointerLeave={() => setHovered(false)}
        >
          <meshBasicMaterial
            ref={materialRef}
            side={DoubleSide}
            color={color}
          />
        </Circle>
        {/* </Interactive> */}
      </>
    );
  }
);
