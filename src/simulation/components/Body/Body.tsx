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
import KeplerBody from '../../classes/KeplerBody';

import { CentralMassContext } from '@/simulation/context/CentralMassContext';
import { BodyMesh } from './BodyMesh';
import Annotation from '../Annotation';
import { BillboardCircle } from '../BillboardCircle';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { CameraControls } from '@react-three/drei';
import { useTimeStore } from '@/simulation/state/zustand/time-store';
import { useSimStore } from '@/simulation/state/zustand/sim-store';

const _pos = new Vector3();
const _vel = new Vector3();

// extend KeplerBody so the reconciler is aware of it
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
  initialPosition: Vector3Tuple;
  initialVelocity: Vector3Tuple;
};
type BodyProps = {
  children?: React.ReactNode;
  params: BodyParams;
  texture?: Texture;
};

const Body = forwardRef<KeplerBody, BodyProps>(function Body(
  { params, ...props }: BodyProps,
  fwdRef
) {
  const { cameraState } = useContext(RootStoreContext);

  // Destructure parameters.
  const { name, color, mass, meanRadius } = params;

  const [initialPosition, initialVelocity] = useMemo(() => {
    const initialPosition: Vector3Tuple = [
      params.initialPosition[0] / DIST_MULT,
      params.initialPosition[1] / DIST_MULT,
      params.initialPosition[2] / DIST_MULT,
    ];
    const initialVelocity: Vector3Tuple = [
      params.initialVelocity[0] / DIST_MULT,
      params.initialVelocity[1] / DIST_MULT,
      params.initialVelocity[2] / DIST_MULT,
    ];
    return [initialPosition, initialVelocity];
  }, [params.initialPosition, params.initialVelocity]);

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

  useFrame(({ controls }) => {
    if (!bodyRef.current || !meshRef.current) return;

    // update mesh position to be in sync with body
    const position = bodyRef.current.position.toArray();
    meshRef.current.position.set(...position);

    // if (!velocityArrowRef.current) return;
    // // update direction of velocity arrow
    // const direction = bodyRef.current.velocity.clone().normalize();
    // velocityArrowRef.current.setDirection(direction);
    // velocityArrowRef.current.position.set(...position);

    // if (
    //   !useTimeStore.getState().isPaused &&
    //   cameraState.focusTarget === bodyRef.current
    // ) {
    //   const camControls = controls as unknown as CameraControls;
    //   console.log('body position:', position);
    //   console.log(
    //     'camera target position:',
    //     camControls.getTarget(_pos).toArray()
    //   );
    //   // cameraState.updateCamera();
    // }
  }, -1);

  return (
    <>
      <keplerBody
        renderOrder={-1}
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
      >
        {/* Child orbits need to know the mass of their central body. */}
        <CentralMassContext.Provider value={mass}>
          {props.children}
        </CentralMassContext.Provider>
      </keplerBody>

      {/** Putting BodyMesh outside of KeplerBody and updating its position manually seems to work. */}
      <BodyMesh
        name={name}
        meanRadius={meanRadius}
        color={color}
        texture={props.texture}
        bodyRef={bodyRef}
        ref={meshRef}
      />

      {/* <arrowHelper
        ref={(arrow) => {
          if (!arrow) return;
          velocityArrowRef.current = arrow;
          arrow.setColor('green');
          arrow.setLength(1, 0.2, 0.05);
        }}
      /> */}
    </>
  );
});

export default Body;
