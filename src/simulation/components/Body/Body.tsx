import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { extend, type Object3DNode, useFrame } from '@react-three/fiber';

import {
  type ColorRepresentation,
  type Mesh,
  type Texture,
  type Vector3Tuple,
  type ArrowHelper,
  Vector3,
} from 'three';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import KeplerBody from '../../classes/KeplerBody';

import { CentralMassContext } from '@/simulation/context/CentralMassContext';
import { BodyMesh } from './BodyMesh';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { VelocityArrow } from '../Orbit/arrows/VelocityArrow';

const _pos = new Vector3();
const _vel = new Vector3();

// extend KeplerBody so the reconciler is aware of it
extend({ KeplerBody });
declare module '@react-three/fiber' {
  interface ThreeElements {
    keplerBody: Object3DNode<KeplerBody, typeof KeplerBody>;
  }
}

export type BodyParams = {
  name: string;
  color: ColorRepresentation;
  mass: number;
  meanRadius: number;
  initialPosition: Vector3Tuple;
  initialVelocity: Vector3Tuple;
};
type BodyProps = {
  children?: React.ReactNode;
  params: BodyParams;
  texture?: Texture;
};

const Body = forwardRef<KeplerBody, BodyProps>(function Body(
  { params, children, texture }: BodyProps,
  fwdRef
) {
  const { cameraState } = useContext(RootStoreContext);

  // Destructure parameters.
  const { name, color, mass, meanRadius, initialPosition, initialVelocity } =
    params;

  // get function from context
  const centralBodyRef = useContext(KeplerTreeContext);

  // get refs
  const bodyRef = useRef<KeplerBody>(null!);
  const meshRef = useRef<Mesh>(null!);
  const velocityArrowRef = useRef<ArrowHelper>(null!);

  // Set forwarded ref
  // the return value of the callback function will be assigned to fwdRef
  useImperativeHandle(
    fwdRef,
    () => {
      return bodyRef.current;
    },
    [bodyRef]
  );

  // useFrame(({ controls }) => {
  //   if (!bodyRef.current || !meshRef.current) return;

  //   // update mesh position to be in sync with body
  //   // meshRef.current.position.copy(bodyRef.current.position);

  //   // velocityArrowRef.current.position.copy(bodyRef.current.position);
  // }, -1);

  return (
    <>
      <keplerBody
        renderOrder={-1}
        ref={(body: KeplerBody) => {
          if (!body) {
            console.log(`removing ${bodyRef.current?.name}`);

            return;
          }

          bodyRef.current = body;

          console.log(`adding ${body?.name} node to tree`);

          // Add self to tree.
          if (!centralBodyRef) return;
          const centralBody = centralBodyRef.current;
          if (!centralBody) return;
          centralBody.addOrbitingBody(body);
        }}
        name={name ?? ''}
        args={[mass, initialPosition, initialVelocity, meanRadius]}
      >
        {/* Child orbits need to know the mass of their central body. */}
        <CentralMassContext.Provider value={mass}>
          <KeplerTreeContext.Provider value={bodyRef}>
            {children}
            <BodyMesh
              name={name}
              meanRadius={meanRadius}
              color={color}
              texture={texture}
              bodyRef={bodyRef}
              ref={meshRef}
            />

            <axesHelper args={[1.5 * (meanRadius / EARTH_RADIUS)]} />
            <VelocityArrow />
          </KeplerTreeContext.Provider>
        </CentralMassContext.Provider>
      </keplerBody>
    </>
  );
});

export default Body;
