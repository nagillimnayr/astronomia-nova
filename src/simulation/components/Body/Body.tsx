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
import KeplerBody from '../../classes/kepler-body';

import { CentralMassContext } from '@/simulation/context/CentralMassContext';
import { BodyMesh } from './BodyMesh';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { VelocityArrow } from '../Orbit/arrows/VelocityArrow';
import { HtmlAnnotation } from '@/simulation/components/Body/annotation/HtmlAnnotation';
import { degToRad } from 'three/src/math/MathUtils';
import { Annotation } from './annotation/Annotation';
import { RingMarker } from './marker/RingMarker';
import { CircleMarker } from './marker/CircleMarker';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

const _pos = new Vector3();
const _vel = new Vector3();

// Extend KeplerBody so the reconciler is aware of it.
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
  obliquity?: number;
  initialPosition?: Vector3Tuple;
  initialVelocity?: Vector3Tuple;
};
type BodyProps = {
  children?: React.ReactNode;
  params: BodyParams;
  texture?: Texture;
};

const Body = forwardRef<KeplerBody | null, BodyProps>(function Body(
  { params, children, texture }: BodyProps,
  fwdRef
) {
  const rootStore = useContext(RootStoreContext);
  const rootActor = rootStore.rootMachine;
  const keplerTreeActor = useSelector(
    rootActor,
    ({ context }) => context.keplerTreeActor
  );

  // Destructure parameters.
  const {
    name,
    color,
    mass,
    meanRadius,
    obliquity,
    initialPosition,
    initialVelocity,
  } = params;

  // get function from context
  const centralBodyRef = useContext(KeplerTreeContext);

  // get refs
  const bodyRef = useRef<KeplerBody>(null!);
  const meshRef = useRef<Mesh>(null!);

  // Set forwarded ref. The return value of the callback function will be assigned to fwdRef.
  useImperativeHandle(
    fwdRef,
    () => {
      return bodyRef.current;
    },
    [bodyRef]
  );

  return (
    <>
      <keplerBody
        renderOrder={-1}
        meshRef={meshRef}
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
          keplerTreeActor.send({ type: 'UPDATE_TREE' });
        }}
        name={name ?? ''}
        args={[mass, initialPosition, initialVelocity, meanRadius, obliquity]}
      >
        {/* Child orbits need to know the mass of their central body. */}
        <KeplerTreeContext.Provider value={bodyRef}>
          {children}
          <BodyMesh
            name={name}
            meanRadius={meanRadius}
            obliquity={obliquity ?? 0}
            color={color}
            texture={texture}
            bodyRef={bodyRef}
            ref={meshRef}
          />

          {/* <object3D position={[0, 0, -(meanRadius / EARTH_RADIUS) * 1.5]}>
            <HtmlAnnotation annotation={name} />
          </object3D> */}

          <RingMarker bodyRef={bodyRef} />
          <CircleMarker bodyRef={bodyRef} color={color} />
          <Annotation annotation={name} meanRadius={meanRadius} />

          {/* <axesHelper args={[1.5 * (meanRadius / EARTH_RADIUS)]} /> */}
          <VelocityArrow />
        </KeplerTreeContext.Provider>
      </keplerBody>
    </>
  );
});

export default Body;
