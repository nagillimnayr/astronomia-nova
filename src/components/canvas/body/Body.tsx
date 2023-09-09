import { KeplerTreeContext } from '@/context/KeplerTreeContext';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { extend, type Object3DNode } from '@react-three/fiber';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  type Material,
  type ColorRepresentation,
  type Mesh,
  type Texture,
  type Vector3Tuple,
  MeshBasicMaterial,
} from 'three';
import { BodyMesh } from './BodyMesh';
import { KeplerBody } from './kepler-body';
import { Tags } from './tags/Tags';

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
  siderealRotationRate?: number;
  siderealRotationPeriod?: number;
};
type BodyProps = {
  children?: React.ReactNode;
  texture?: Texture;
  material?: Material;
} & BodyParams;

export const Body = forwardRef<KeplerBody | null, BodyProps>(function Body(
  { children, texture, material, ...props }: BodyProps,
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
    siderealRotationRate,
    siderealRotationPeriod,
  } = props;

  // Get central body from context.
  const centralBodyRef = useContext(KeplerTreeContext);

  // Get refs.
  const bodyRef = useRef<KeplerBody>(null!);
  const meshRef = useRef<Mesh>(null!);

  // Set forwarded ref. The return value of the callback function will be
  // assigned to fwdRef.
  useImperativeHandle(
    fwdRef,
    () => {
      return bodyRef.current;
    },
    [bodyRef]
  );

  // If material is undefined, create one.
  material = useMemo(() => {
    return (
      material ??
      new MeshBasicMaterial({
        color: color,
        map: texture,
      })
    );
  }, [color, material, texture]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    mapActor.send({ type: 'ADD_BODY', body: body });
  }, [mapActor]);
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    // Add self to tree.
    if (!centralBodyRef) return;
    const centralBody = centralBodyRef.current;
    if (!centralBody) return;
    centralBody.addOrbitingBody(body);
  }, [centralBodyRef]);

  return (
    <>
      <keplerBody
        meshRef={meshRef}
        ref={bodyRef}
        name={name ?? ''}
        args={[mass, initialPosition, initialVelocity]}
        meanRadius={meanRadius}
        obliquity={obliquity}
        siderealRotationRate={siderealRotationRate}
        siderealRotationPeriod={siderealRotationPeriod}
      >
        {/* Make self available to children through context. */}
        <KeplerTreeContext.Provider value={bodyRef}>
          {children}
          <BodyMesh
            name={name}
            meanRadius={meanRadius}
            obliquity={obliquity ?? 0}
            material={material}
            bodyRef={bodyRef}
            ref={meshRef}
            siderealRotationRate={siderealRotationRate ?? 0}
          />

          <Tags name={name} bodyRef={bodyRef} meanRadius={meanRadius} />
          {/* <VelocityArrow /> */}
        </KeplerTreeContext.Provider>
      </keplerBody>
    </>
  );
});
