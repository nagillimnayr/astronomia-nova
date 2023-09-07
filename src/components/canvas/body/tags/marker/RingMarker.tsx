/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Circle, MeshDiscardMaterial, Ring} from '@react-three/drei';
import type KeplerBody from '@/components/canvas/body/kepler-body';
import {forwardRef, type MutableRefObject, type PropsWithChildren, useMemo,} from 'react';
import {type ColorRepresentation, FrontSide, type Mesh} from 'three';

import {useSelector} from '@xstate/react';
import {MachineContext} from '@/state/xstate/MachineProviders';
import {animated, useSpring} from '@react-spring/three';

type MarkerProps = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
  color: ColorRepresentation;
};
export const RingMarker = forwardRef<Mesh, MarkerProps>(function RingMarker(
  { children, bodyRef, color }: MarkerProps,
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

  const isVisible = useSelector(markers, (state) => state.matches('active'));
  const isSelected = Object.is(bodyRef.current, selected);

  const spring = useSpring({
    opacity: isVisible ? 1 : 0,
    color: isSelected ? 'white' : color.toString(),
  });

  const ringArgs: [number, number, number] = useMemo(() => {
    const outerRadius = 1;
    const innerRadius = 0.9;
    const segments = 32;
    return [innerRadius, outerRadius, segments];
  }, []);

  return (
    <>
      <group>
        <Ring ref={fwdRef} visible={isVisible} args={ringArgs} scale={1}>
          {/** @ts-ignore */}
          <animated.meshBasicMaterial
            color={spring.color}
            side={FrontSide}
            transparent={true}
            opacity={spring.opacity}
          />
          {/* <axesHelper args={[radius * 2]} /> */}
          {children}
        </Ring>
        {/** Invisible circle to catch pointer events. */}
        <Circle>
          <MeshDiscardMaterial />
        </Circle>
      </group>
    </>
  );
});
