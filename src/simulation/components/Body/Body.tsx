import React, {
  forwardRef,
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
} from '@react-three/fiber';

import {
  type ColorRepresentation,
  type Mesh,
  type Vector3,
  type Texture,
} from 'three';
import KeplerTreeContext from '../../context/KeplerTreeContext';
import KeplerBody from '../../classes/KeplerBody';
import { MeshLineGeometry, Edges, Trail } from '@react-three/drei';
import { TextureLoader } from 'three';
import Vec3 from '~/simulation/types/Vec3';
import Annotation from '../Annotation';
import { select, simState, unselect } from '~/simulation/state/SimState';
import { Selection, Select } from '@react-three/postprocessing';
import { useSnapshot } from 'valtio';

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
  meanRadius: number;
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

  // get bounds
  //const bounds = useBounds();

  const [isSelected, setSelected] = useState<boolean>(false);
  //const snap = useSnapshot(simState.selected);

  // get three.js state
  const getState = useThree((state) => state.get);

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

  const focus = () => {
    const state = getState();
    console.log('focus: ', bodyRef.current.name);

    const targetPos = bodyRef.current.position;

    // bounds.refresh(bodyRef.current);
    // bounds.fit();
    // bounds.to({
    //   position: bodyRef.current.position.toArray(),
    //   target: bodyRef.current.position.toArray(),
    // });

    const camera = state.camera;

    // attach camera to our target so it moves along with it
    camera.parent?.remove(camera);
    bodyRef.current.add(camera);

    camera.lookAt(targetPos);
    camera.updateProjectionMatrix();
  };

  // event handlers
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!bodyRef.current) {
      return;
    }
    const body: KeplerBody = bodyRef.current;

    //console.log(`${body.name}:`, body);

    setSelected(true);
    select(body);
    //focus();
  };
  const handleMiss = (e: MouseEvent) => {
    if (isSelected && simState.selected) {
      setSelected(simState.selected.name === bodyRef.current.name);
    }
  };

  return (
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
      args={[mass, initialPosition, initialVelocity]}
      onClick={handleClick}
      onPointerMissed={handleMiss}
    >
      <Select enabled={isSelected}>
        <mesh
          visible
          ref={meshRef}
          scale={
            isSelected ? props.args.meanRadius * 1.25 : props.args.meanRadius
          }
        >
          <sphereGeometry />
          {props.texturePath ? (
            <meshBasicMaterial map={texture} />
          ) : (
            <meshBasicMaterial color={props.args.color} />
          )}
        </mesh>
      </Select>
      <Trail
        ref={trailRef}
        target={meshRef}
        width={1}
        length={300}
        decay={0.001}
        color={props.args.color}
      />

      <KeplerTreeContext.Provider value={addChildToTree}>
        {props.children}
      </KeplerTreeContext.Provider>

      <Annotation annotation={props.args.name} />
    </keplerBody>
  );
});

export default Body;
