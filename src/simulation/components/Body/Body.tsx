import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  extend,
  type Object3DNode,
  type ThreeEvent,
  useLoader,
} from '@react-three/fiber';

import {
  type ColorRepresentation,
  type Mesh,
  type Vector3,
  type Texture,
} from 'three';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import KeplerBody from '../../classes/KeplerBody';
import { Trail } from '~/drei-imports/abstractions/Trail';
import { MeshLineGeometry } from '@react-three/drei';
import { TextureLoader } from 'three';
import Vec3 from '~/simulation/types/Vec3';
import { Html } from '~/drei-imports/abstractions/text/Html';
import Annotation from '../Annotation';

// extend KeplerBody so the reconciler is aware of it
extend({ KeplerBody });
declare module '@react-three/fiber' {
  interface ThreeElements {
    keplerBody: Object3DNode<KeplerBody, typeof KeplerBody>;
  }
}

type BodyAttributes = {
  name: string;
  color: ColorRepresentation;
  mass?: number;
  initialPosition?: Vec3;
  initialVelocity?: Vec3;
  meanRadius?: number;
};
type BodyProps = {
  children?: React.ReactNode;
  args: BodyAttributes;
  texturePath?: string;
};

const Body = forwardRef<KeplerBody, BodyProps>(function Body(
  props: BodyProps,
  fwdRef
) {
  // destructure parameters
  const { name, color, mass, initialPosition, initialVelocity } = props.args;

  // load texture
  const texture = useLoader(TextureLoader, props.texturePath ?? '');

  // get function from context
  const addSelfToTree = useContext(KeplerTreeContext);

  // get refs
  const meshRef = useRef<Mesh>(null!);
  const bodyRef = useRef<KeplerBody>(null!);
  const childrenRefs = useRef<KeplerBody[]>([]);
  const trailRef = useRef<MeshLineGeometry>(null!);

  const addChildToTree = (body: KeplerBody) => {
    if (!body) {
      return;
    }
    // add child to array
    childrenRefs.current.push(body);

    // setup attachment with parent
    const parent: KeplerBody = body.parent as KeplerBody;
    console.assert(parent, 'failed to cast to parent');
    parent.addOrbitingBody(body);
  };

  // Set forwarded ref
  // the return value of the callback function will be assigned to fwdRef
  useImperativeHandle(
    fwdRef,
    () => {
      return bodyRef.current;
    },
    [bodyRef]
  );

  // event handlers
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!bodyRef.current) {
      return;
    }
    const body: KeplerBody = bodyRef.current;
    //const parent = body.parent;
    console.log(`${body.name}:`, body);
  };

  return (
    <keplerBody
      ref={(body: KeplerBody) => {
        bodyRef.current = body;

        console.log(`adding ${body?.name} node to tree`);

        // pass ref to parent to add it to the tree
        addSelfToTree(body);
      }}
      name={name ?? ''}
      args={[mass, initialPosition, initialVelocity]}
      onClick={handleClick}
    >
      <mesh visible ref={meshRef} scale={props.args.meanRadius ?? 1}>
        <sphereGeometry />
        {props.texturePath ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshBasicMaterial color={props.args.color} />
        )}

        <Trail
          ref={trailRef}
          target={meshRef}
          width={1}
          length={400}
          decay={0.1}
          color={props.args.color}
        />
      </mesh>

      <KeplerTreeContext.Provider value={addChildToTree}>
        {props.children}
      </KeplerTreeContext.Provider>

      <Annotation annotation={props.args.name} />
    </keplerBody>
  );
});

export default Body;
