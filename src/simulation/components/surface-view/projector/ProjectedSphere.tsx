import type KeplerBody from '@/simulation/classes/kepler-body';
import { colorMap } from '@/simulation/utils/color-map';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Circle, Ring, Sphere, Trail } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useCallback, useRef } from 'react';
import {
  type ArrowHelper,
  type Mesh,
  type Object3D,
  Vector3,
  Spherical,
  DoubleSide,
  Group,
} from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { useSelector } from '@xstate/react';
import { METER, PI, PI_OVER_TWO } from '@/simulation/utils/constants';
import { BodyTrail } from '../../Body/trail/BodyTrail';
import { ProjectedTrail } from './ProjectedTrail';

const _pos = new Vector3();
const _otherPos = new Vector3();
const _bodyPos = new Vector3();
const _diff = new Vector3();
const _direction = new Vector3();
const _projectedPos = new Vector3();
const _cameraPos = new Vector3();
const _spherical = new Spherical();

type Props = {
  body: KeplerBody;
  radius: number;
};

export const ProjectedSphere = ({ body, radius }: Props) => {
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const surfaceView = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );

  const ref = useRef<Mesh>(null!);
  const pivotRef = useRef<Object3D>(null!);
  const anchorRef = useRef<Group>(null!);
  const arrowRef = useRef<ArrowHelper>(null!);

  const updateRotation = useCallback(() => {
    // if (!surfaceView) return; // Only update if in surface view.
    if (!pivotRef.current || !body) return;
    const anchor = anchorRef.current;
    const pivot = pivotRef.current;
    body.getWorldPosition(_bodyPos); // Get world position of the body.
    anchor.worldToLocal(_bodyPos); // Get position relative to center of projection sphere.
    _spherical.setFromVector3(_bodyPos); // Get spherical coords.
    _spherical.makeSafe();

    let { phi } = _spherical;
    const { theta } = _spherical;
    phi -= PI_OVER_TWO;

    // pivot.rotation.set(phi, theta, 0, 'YXZ'); // Reset rotation.
    pivot.rotation.set(0, 0, 0); // Reset rotation.
    pivot.rotateY(theta);
    pivot.rotateX(phi);
  }, [body]);

  useFrame(() => {
    updateRotation();
  });

  if (!body) return;
  const color = colorMap.get(body.name);
  console.log('proj', body.name);
  return (
    <>
      <group ref={anchorRef}>
        {/* <axesHelper args={[radius]} /> */}
        {/* <arrowHelper
          ref={(arrow) => {
            if (!arrow) return;
            arrowRef.current = arrow;
            if (!color) return;
            arrow.setColor(color);
          }}
        /> */}
        <object3D ref={pivotRef}>
          {/* <Sphere
            visible={true}
            ref={ref}
            position-z={-radius} // Distance from center point.
            scale={3e5}
          >
            <meshBasicMaterial color={color} side={DoubleSide} />
          </Sphere> */}
          <Circle
            // visible={surfaceView} // Should only be visible in surface view.
            visible={true}
            ref={ref}
            args={[1, 6]}
            position-z={radius} // Distance from center point.
            scale={5e4}
            rotation-y={PI}
          >
            <meshBasicMaterial color={color} />
            {/* <axesHelper /> */}
            <Ring args={[0.8, 1]} position-z={1e-2} scale={1.3}>
              <meshBasicMaterial color={'white'} side={DoubleSide} />
            </Ring>
            <Circle position-z={1e-2} scale={0.1}>
              <meshBasicMaterial color={'white'} side={DoubleSide} />
            </Circle>
          </Circle>
        </object3D>
        <ProjectedTrail targetRef={ref} length={20} color={color} />
      </group>
    </>
  );
};
