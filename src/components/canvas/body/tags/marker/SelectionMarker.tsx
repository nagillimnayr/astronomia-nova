/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Circle, MeshDiscardMaterial, Ring} from '@react-three/drei';
import type KeplerBody from '@/components/canvas/body/kepler-body';
import {forwardRef, type MutableRefObject, type PropsWithChildren, useMemo,} from 'react';
import {FrontSide, type Mesh} from 'three';

import {useSelector} from '@xstate/react';
import {MachineContext} from '@/state/xstate/MachineProviders';
import {animated, useSpring} from '@react-spring/three';

type SelectionMarkerProps = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
};
export const SelectionMarker = forwardRef<Mesh, SelectionMarkerProps>(
  function SelectionMarker(
    { children, bodyRef }: SelectionMarkerProps,
    fwdRef
  ) {
    const { visibilityActor, selectionActor } = MachineContext.useSelector(
      ({ context }) => context
    );
    const markers = useSelector(
      visibilityActor,
      ({ context }) => context.markers
    );
    const selected = useSelector(
      selectionActor,
      ({ context }) => context.selected
    );

    const isVisible =
      useSelector(markers, (state) => state.matches('active')) &&
      Boolean(selected) &&
      Object.is(bodyRef.current, selected);

    const scale = 1.35;
    const spring = useSpring({
      opacity: isVisible ? 1 : 0,
      scale: isVisible ? scale : 0,
    });

    const ringArgs: [number, number, number] = useMemo(() => {
      const outerRadius = 1;
      const innerRadius = 0.9;
      const segments = 32;
      return [innerRadius, outerRadius, segments];
    }, []);

    return (
      <>
        <animated.group scale={spring.scale}>
          <Ring ref={fwdRef} args={ringArgs}>
            {/** @ts-ignore */}
            <animated.meshBasicMaterial
              color={'white'}
              side={FrontSide}
              // transparent={true}
              // opacity={spring.opacity}
            />
            {children}
          </Ring>

          {/** Invisible circle to catch pointer events. */}
          <Circle>
            <MeshDiscardMaterial />
          </Circle>
        </animated.group>
      </>
    );
  }
);
