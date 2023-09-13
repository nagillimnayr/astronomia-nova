import { KeplerTreeContext } from '@/context/KeplerTreeContext';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { extend, type Object3DNode } from '@react-three/fiber';
import React, {
  forwardRef,
  memo,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactNode,
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

/**
 * The props type for {@link Body}
 * @category Props
 */
export type BodyProps = {
  children?: ReactNode;
  texture?: Texture;
  material?: Material;
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

/**
 * Component wrapper around the {@link KeplerBody} class.
 * @category Component
 */
export const Body = memo(
  forwardRef<KeplerBody, BodyProps>(function Body(
    {
      children,
      texture,
      material,
      name,
      color,
      mass,
      meanRadius,
      obliquity,
      initialPosition,
      initialVelocity,
      siderealRotationRate,
      siderealRotationPeriod,
    }: BodyProps,
    fwdRef: React.ForwardedRef<KeplerBody>
  ): ReactNode {
    const { mapActor } = MachineContext.useSelector(({ context }) => context);

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
  })
);
