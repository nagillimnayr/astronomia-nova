import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  extend,
  type Object3DNode,
  type ThreeEvent,
  useLoader,
  useThree,
  useFrame,
} from '@react-three/fiber';

import {
  type ColorRepresentation,
  type Mesh,
  Vector3,
  type Texture,
  BoxHelper,
  Vector3Tuple,
  ArrowHelper,
} from 'three';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import KeplerBody from '../../classes/KeplerBody';
import {
  MeshLineGeometry,
  Edges,
  Trail,
  useHelper,
  BBAnchor,
} from '@react-three/drei';
import { TextureLoader } from 'three';

import { CentralMassContext } from '@/simulation/context/CentralMassContext';
import { debugState } from '@/simulation/state/DebugState';
import { BodyMesh } from './BodyMesh';
import Annotation from '../Annotation';

// extend KeplerBody so the reconciler is aware of it
extend({ KeplerBody });
declare module '@react-three/fiber' {
  interface ThreeElements {
    keplerBody: Object3DNode<KeplerBody, typeof KeplerBody>;
  }
}

export type BodyArgs = {
  name: string;
  color: ColorRepresentation;
  mass: number;
  meanRadius: number;
  initialPosition: Vector3;
  initialVelocity: Vector3;
};
type BodyProps = {
  children?: React.ReactNode;
  args: BodyArgs;
  texture?: Texture;
};

const Body = forwardRef<KeplerBody, BodyProps>(function Body(
  props: BodyProps,
  fwdRef
) {
  // destructure parameters
  const { name, color, mass, initialPosition, initialVelocity } = props.args;

  // load texture
  // const texture = useLoader(TextureLoader, props.texturePath ?? '');

  // get function from context
  const addSelfToTree = useContext(KeplerTreeContext);

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

  useFrame(() => {
    if (!bodyRef.current || !meshRef.current) return;

    // update mesh position to be in sync with body
    const position = bodyRef.current.position.toArray();
    meshRef.current.position.set(...position);

    if (!velocityArrowRef.current) return;
    // update direction of velocity arrow
    const direction = bodyRef.current.velocity.clone().normalize();
    velocityArrowRef.current.setDirection(direction);
    velocityArrowRef.current.position.set(...position);
  });

  return (
    <>
      <keplerBody
        ref={(body: KeplerBody) => {
          if (!body) {
            console.log(`removing ${bodyRef.current?.name} node from tree`);
            if (!bodyRef.current) {
              return;
            }
            const parent = bodyRef.current.parent as KeplerBody;
            if (!parent) {
              return;
            }
            //parent?.removeOrbitingBody(bodyRef.current);

            return;
          }

          bodyRef.current = body;

          console.log(`adding ${body?.name} node to tree`);

          // pass ref to parent to add it to the tree
          addSelfToTree(body);
        }}
        name={name ?? ''}
        args={[mass, initialPosition.toArray(), initialVelocity.toArray()]}
      >
        {/** for some reason, wrapping the Annotation in an object3D stops it from stuttering */}
        <object3D>
          <Annotation annotation={props.args.name} />
        </object3D>

        {/** for whatever reason, the same does not work for BodyMesh */}
        {/* <object3D>
          <BodyMesh
            name={props.args.name}
            meanRadius={props.args.meanRadius}
            color={props.args.color}
            texture={props.texture}
            body={bodyRef}
          />
        </object3D> */}

        {/* child orbits need to know the mass of their central body */}
        <CentralMassContext.Provider value={props.args.mass}>
          {props.children}
        </CentralMassContext.Provider>
      </keplerBody>

      {/** putting BodyMesh outside of KeplerBody and updating its position manually does however */}
      <BodyMesh
        name={props.args.name}
        meanRadius={props.args.meanRadius}
        color={props.args.color}
        texture={props.texture}
        body={bodyRef}
        ref={meshRef}
      />

      <arrowHelper
        ref={(arrow) => {
          if (!arrow) return;
          velocityArrowRef.current = arrow;
          arrow.setColor('green');
          arrow.setLength(1, 0.2, 0.05);
        }}
      />
    </>
  );
});

export default Body;
