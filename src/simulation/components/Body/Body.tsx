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
import Vec3 from '@/simulation/types/Vec3';
import Annotation from '../Annotation';
import { simState } from '@/simulation/state/SimState';
import { Selection, Select } from '@react-three/postprocessing';
import { useSnapshot } from 'valtio';
import { Orbit } from '../Orbit/Orbit';
import { KeplerOrbit } from '@/simulation/classes/KeplerOrbit';
import { OrbitalElements } from '@/simulation/classes/OrbitalElements';
import { Trajectory } from '../Orbit/Trajectory/Trajectory';
import { CentralMassContext } from '@/simulation/context/CentralMassContext';
import { debugState } from '@/simulation/state/DebugState';
import { BodyMesh } from './BodyMesh';

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
  // texturePath?: string;
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

  // Set forwarded ref
  // the return value of the callback function will be assigned to fwdRef
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
        {/* <BodyMesh
          name={props.args.name}
          meanRadius={props.args.meanRadius}
          color={props.args.color}
          texture={texture}
        /> */}

        {/* <KeplerTreeContext.Provider value={addChildToTree}> */}

        {/* child orbits need to know the mass of their central body */}
        <CentralMassContext.Provider value={props.args.mass}>
          {props.children}
        </CentralMassContext.Provider>

        {/* </KeplerTreeContext.Provider> */}
      </keplerBody>
    </>
  );
});

export default Body;
