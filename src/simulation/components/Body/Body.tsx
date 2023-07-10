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
import { MeshLineGeometry, Edges, Trail, useHelper } from '@react-three/drei';
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
    if (!bodyRef || !meshRef) return;
    // update mesh position to be in sync with body
    meshRef.current.position.set(...bodyRef.current.position.toArray());
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
        <object3D>
          <BodyMesh
            name={props.args.name}
            meanRadius={props.args.meanRadius}
            color={props.args.color}
            texture={props.texture}
            body={bodyRef}
          />
        </object3D>

        <object3D>
          <Annotation annotation={props.args.name} />
        </object3D>

        {/* <Annotation annotation={props.args.name} /> */}
        {/* <KeplerTreeContext.Provider value={addChildToTree}> */}

        {/* child orbits need to know the mass of their central body */}
        <CentralMassContext.Provider value={props.args.mass}>
          {props.children}
        </CentralMassContext.Provider>

        {/* </KeplerTreeContext.Provider> */}
      </keplerBody>
      <BodyMesh
        name={props.args.name}
        meanRadius={props.args.meanRadius}
        color={props.args.color}
        texture={props.texture}
        body={bodyRef}
        ref={meshRef}
      />
    </>
  );
});

export default Body;
