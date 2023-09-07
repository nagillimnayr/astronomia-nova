import type KeplerBody from '@/simulation/classes/kepler-body';
import { useCallback, useMemo, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { colorMap } from '@/simulation/utils/color-map';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import {
  type Group,
  type Mesh,
  type Object3D,
  Spherical,
  Vector3,
} from 'three';
import { METER, PI_OVER_TWO } from '@/simulation/utils/constants';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { PI } from '../../../../utils/constants';

const threshold = 0.02;
const DIST_TO_CAM_THRESHOLD = 1e8 * METER;

const _spherical = new Spherical();

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();
const _direction = new Vector3();
const _tagPos = new Vector3();

const RADIUS = 5;

type Props = {
  body: KeplerBody;
};
export const VRProjectedTag = ({ body }: Props) => {
  const { cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const getThree = useThree(({ get }) => get);

  const color = useMemo(() => {
    const color = colorMap.get(body.name);
    return color;
  }, [body.name]);

  const pivotRef = useRef<Object3D>(null!);
  const tagRef = useRef<Group>(null!);
  const textRef = useRef<Object3D>(null!);
  const circleRef = useRef<Mesh>(null!);
  const markerRef = useRef<Group>(null!);

  const [spring, springRef] = useSpring(() => ({ scale: 1 }));

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      if ('stopPropagation' in event) {
        event.stopPropagation();
      }
      const group = tagRef.current;
      if (!group.visible) return;
      // Select body.
      selectionActor.send({ type: 'SELECT', selection: body });
    },
    [body, selectionActor]
  );

  const handlePointerEnter = useCallback(() => {
    springRef.start({ scale: 1.5 });
  }, [springRef]);
  const handlePointerLeave = useCallback(() => {
    springRef.start({ scale: 1 });
  }, [springRef]);

  useFrame(({ camera }) => {
    camera.getWorldPosition(_camWorldPos);
    body.getWorldPosition(_bodyWorldPos);
    camera.worldToLocal(_tagPos.copy(_bodyWorldPos));
    _spherical.setFromVector3(_tagPos);
    _spherical.makeSafe();

    const phi = PI_OVER_TWO - _spherical.phi;
    const theta = _spherical.theta;
    const pivot = pivotRef.current;
    pivot.rotation.set(0, 0, 0);
    pivot.rotateY(theta);
    pivot.rotateX(-phi);
    // tag.position.set(0, 0, -RADIUS);
  });

  return (
    <object3D name="pivot" ref={pivotRef}>
      <animated.group
        ref={tagRef}
        scale={spring.scale}
        position-z={RADIUS}
        rotation-y={PI}
      >
        <group
          ref={markerRef}
          onClick={handleClick}
          onPointerOver={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <Interactive
            onSelect={handleClick}
            onHover={handlePointerEnter}
            onBlur={handlePointerLeave}
          >
            <animated.mesh
              ref={circleRef}
              material-color={color ?? 'white'}
              scale={0.1}
            >
              <circleGeometry />
            </animated.mesh>
          </Interactive>
        </group>
        {/* <axesHelper args={[10]} ref={axesRef} /> */}
        <object3D ref={textRef} position-y={-0.3}>
          <Text fontSize={0.1}>{body.name}</Text>
        </object3D>
      </animated.group>
    </object3D>
  );
};
