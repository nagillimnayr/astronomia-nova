import { type KeplerBody } from '@/components/canvas/body/kepler-body';
import { PI_OVER_TWO } from '@/constants/constants';
import { colorMap } from '@/helpers/color-map';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useCallback, useMemo, useRef } from 'react';
import {
  type ArrowHelper,
  type Group,
  type Mesh,
  type Object3D,
  Spherical,
  Vector3,
} from 'three';
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

  const targetRef = useRef<Object3D>(null!);
  const markerRef = useRef<Mesh>(null!);
  const pivotRef = useRef<Object3D>(null!);
  const anchorRef = useRef<Group>(null!);
  const arrowRef = useRef<ArrowHelper>(null!);

  const updateRotation = useCallback(() => {
    // if (!surfaceView) return; // Only update if in surface view.
    if (!pivotRef.current || !body) return;
    const anchor = anchorRef.current;
    const pivot = pivotRef.current;
    body.getWorldPosition(_bodyPos); // Get world position of the body.
    anchor.worldToLocal(_bodyPos); // Get position relative to center of
    // projection sphere.
    _spherical.setFromVector3(_bodyPos); // Get spherical coords.
    _spherical.makeSafe();

    let { phi } = _spherical;
    const { theta } = _spherical;
    phi -= PI_OVER_TWO;

    pivot.rotation.set(phi, theta, 0, 'YXZ'); // Reset rotation.
    // pivot.rotation.set(0, 0, 0); // Reset rotation.
    // pivot.rotateY(theta);
    // pivot.rotateX(phi);
  }, [body]);

  useFrame(() => {
    updateRotation();
  });

  const circleArgs: [number, number] = useMemo(() => {
    const radius = 1;
    const segments = 6;
    return [radius, segments];
  }, []);

  if (!body) return;
  const color = colorMap.get(body.name);
  return (
    <>
      <group ref={anchorRef}>
        {/* <axesHelper args={[radius]} /> */}

        <object3D ref={pivotRef}>
          {/* <Sphere
           visible={true}
           ref={ref}
           position-z={-radius} // Distance from center point.
           scale={3e5}
           >
           <meshBasicMaterial color={color} side={DoubleSide} />
           </Sphere> */}
          {/* <Circle
           // visible={surfaceView} // Should only be visible in surface view.
           visible={false}
           ref={markerRef}
           args={circleArgs}
           position-z={radius} // Distance from center point.
           scale={radius / 100}
           rotation-y={PI}
           material-color={color}
           > */}
          {/* <Ring args={[0.8, 1]} position-z={1e-2} scale={1.3}>
           <meshBasicMaterial color={'white'} side={DoubleSide} />
           </Ring> */}
          {/* <Circle position-z={1e-2} scale={0.1}>
           <meshBasicMaterial color={'white'} side={DoubleSide} />
           </Circle> */}
          {/* </Circle> */}
          <object3D ref={targetRef} position-z={radius} />
        </object3D>
        <ProjectedTrail body={body} length={100} color={color} />
      </group>
    </>
  );
};
