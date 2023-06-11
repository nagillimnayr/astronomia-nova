import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { extend, Object3DNode, ThreeEvent, useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import {
  ColorRepresentation,
  Mesh,
  Object3D,
  Vector3,
  Color,
  Material,
  Texture,
} from "three";
import { DynamicBody } from "../../Classes/Dynamics";
//import GravBody from '../../Classes/GravBody';
import KeplerTreeContext from "../../context/KeplerTreeContext";
import KeplerBody from "../../Classes/KeplerBody";

// extend DynamicBody so the reconciler is aware of it
// extend({ DynamicBody });
// declare module '@react-three/fiber' {
//   interface ThreeElements {
//     dynamicBody: Object3DNode<DynamicBody, typeof DynamicBody>;
//   }
// }
// extend KeplerBody so the reconciler is aware of it
extend({ KeplerBody });
declare module "@react-three/fiber" {
  interface ThreeElements {
    keplerBody: Object3DNode<KeplerBody, typeof KeplerBody>;
  }
}

type BodyAttributes = {
  name: string;
  color: ColorRepresentation;
  mass?: number;
  initialPosition?: Vector3;
  initialVelocity?: Vector3;
};
type BodyProps = {
  children?: React.ReactNode;
  args: BodyAttributes;
  texture?: Texture;
};

const Body = forwardRef<KeplerBody, BodyProps>((props: BodyProps, fwdRef) => {
  const { name, color, mass, initialPosition, initialVelocity } = props.args;

  // Get function from context
  const addSelfToTree = useContext(KeplerTreeContext);

  // get refs
  const meshRef = useRef<Mesh>(null!);
  const bodyRef = useRef<KeplerBody>(null!);
  const childrenRefs = useRef<KeplerBody[]>([]);

  const addChildToTree = (body: KeplerBody) => {
    // add child to array
    childrenRefs.current.push(body);

    // setup attachment with parent
    const parent: KeplerBody = body.parent as KeplerBody;
    console.assert(parent, "failed to cast to parent");
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
    const parent = body.parent;
    console.log(`${body.name}:`, body);
  };

  return (
    <keplerBody
      ref={(body: KeplerBody) => {
        bodyRef.current = body;

        console.log(`adding ${body.name} node to tree`);

        // pass ref to parent to add it to the tree
        addSelfToTree(body);
      }}
      name={name ?? ""}
      args={[mass, initialPosition, initialVelocity]}
      onClick={handleClick}
    >
      <mesh visible ref={meshRef}>
        <sphereGeometry />
        {<meshBasicMaterial map={props.texture} />}
        <Trail target={meshRef} width={2} length={500} decay={0.1} />
      </mesh>

      <KeplerTreeContext.Provider value={addChildToTree}>
        {props.children}
      </KeplerTreeContext.Provider>
    </keplerBody>
  );
});

export default Body;
