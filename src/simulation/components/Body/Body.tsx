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
} from 'three';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import KeplerBody from '../../classes/kepler-body';

import { BodyMesh } from './BodyMesh';
import { VelocityArrow } from '../Orbit/arrows/VelocityArrow';

import { MachineContext } from '@/state/xstate/MachineProviders';
import { Tags } from './tags/Tags';
import { BodyTrail } from './trail/BodyTrail';
import { DIST_MULT, PI_OVER_TWO } from '@/simulation/utils/constants';

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
  siderealRotRate?: number;
  siderealRotationPeriod?: number;
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
  const { mapActor } = MachineContext.useSelector(({ context }) => context);

  // Destructure parameters.
  const {
    name,
    color,
    mass,
    meanRadius,
    obliquity,
    initialPosition,
    initialVelocity,
    siderealRotRate,
    siderealRotationPeriod,
  } = params;

  console.log(`render ${name}`);
  // Get central body from context.
  const centralBodyRef = useContext(KeplerTreeContext);

  // Get refs.
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
        meshRef={meshRef}
        ref={(body: KeplerBody) => {
          if (!body) return;

          if (bodyRef.current === body) return;
          bodyRef.current = body;
          mapActor.send({ type: 'ADD_BODY', body: body });

          // Add self to tree.
          if (!centralBodyRef) return;
          const centralBody = centralBodyRef.current;
          if (!centralBody) return;
          centralBody.addOrbitingBody(body);
        }}
        name={name ?? ''}
        args={[
          {
            mass,
            initialPosition,
            initialVelocity,
            meanRadius,
            obliquity,
            siderealRotationPeriod,
            siderealRotationRate: siderealRotRate,
          },
        ]}
      >
        {/* Make self available to children through context. */}
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
            siderealRotRate={siderealRotRate ?? 0}
          />

          <Tags name={name} bodyRef={bodyRef} meanRadius={meanRadius} />
          {/* <axesHelper args={[1.5 * (meanRadius / DIST_MULT)]} /> */}
          <VelocityArrow />
        </KeplerTreeContext.Provider>
      </keplerBody>
    </>
  );
});

export default Body;
