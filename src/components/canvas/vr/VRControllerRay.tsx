import { PI } from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { animated, useSpring } from '@react-spring/three';
import { Line } from '@react-three/drei';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useController, useXR } from '@react-three/xr';
import { useMemo, useRef } from 'react';
import { Euler, Intersection, Object3D, Vector3 } from 'three';
import { Line2 } from 'three-stdlib';
import { VRHoverIndicator } from './VRHoverIndicator';

const RAY_LENGTH = 1e3;

const _camWorldPos = new Vector3();
const _indicatorWorldPos = new Vector3();
const _objWorldPos = new Vector3();
const _worldNormal = new Vector3();
const _lookPos = new Vector3();

type VRControllerRayProps = {
  handedness: XRHandedness;
};
/**
 *
 * @param handedness
 * @constructor
 * @return {JSX.Element}
 */
export const VRControllerRay = ({ handedness }: VRControllerRayProps) => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const getThree = useThree(({ get }) => get);
  const getXR = useXR(({ get }) => get);
  const controller = useController(handedness);

  const lineRef = useRef<Line2>(null!);
  const indicatorRef = useRef<Object3D>(null!);
  const objRef = useRef<Object3D>(null!);

  const points = useMemo(() => {
    return [new Vector3(0, 0, 0), new Vector3(0, 0, 1)];
  }, []);
  const scale = useMemo(() => {
    return new Vector3(1, 1, 1);
  }, []);
  scale.set(1, 1, RAY_LENGTH);
  const rotation = useMemo(() => {
    return new Euler(0, 0, 0);
  }, []);
  rotation.set(0, PI, 0);

  const [spring, springRef] = useSpring(() => ({
    indicatorScale: 1,
  }));

  const indicatorRadius = 0.02;

  useFrame(({ camera, gl }) => {
    if (!getXR().isPresenting) return;
    const line = lineRef.current;
    const indicator = indicatorRef.current;
    const scaleObj = objRef.current; // For modifying scale based on distance
    // to camera.
    if (!line || !indicator || !scaleObj) return;

    // Get hover state.
    const hoverState = getXR().hoverState[handedness];

    const intersections = hoverState.values();
    const iter = intersections.next();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const intersection: Intersection = iter.value;

    if (!intersection) {
      line.scale.setZ(RAY_LENGTH);
      springRef.start({ indicatorScale: 0 });
      return;
    }

    springRef.start({ indicatorScale: 1 });
    const distance = intersection.distance;
    // Set ray length and indicator position.
    line.scale.setZ(distance);
    indicator.position.set(0, 0, distance - 0.02);

    // Get intersection object.
    const obj = intersection.object;
    // Get point of intersection.
    const point = intersection.point;

    const face = intersection.face;
    if (face) {
      // const { controls } = cameraActor.getSnapshot()!.context;
      // if (controls && controls.isMoving) return;

      const normal = face.normal;

      obj.getWorldPosition(_objWorldPos);
      _worldNormal.copy(normal);
      // Get the normal in world coordinates.
      obj.localToWorld(_worldNormal);
      // Subtract object's world position so that we just get the direction.
      _worldNormal.sub(_objWorldPos);

      // Add the direction to the indicator's world position to get the
      // position to look at.
      indicator.getWorldPosition(_indicatorWorldPos);
      _lookPos.addVectors(_indicatorWorldPos, _worldNormal);

      if (handedness === 'right') {
        // console.log('camera isMoving?:', controls?.isMoving);
        // console.log('intersection:', intersection);
        // console.log('intersection face:', face);
        // console.log('intersection normal:', normal);
        // console.log('intersection object:', obj);
        // console.log(indicator.position.toArray());
      }
    } else if (controller) {
      controller.controller.getWorldPosition(_lookPos);
    }

    // Look in direction of the normal.
    indicator.lookAt(_lookPos);

    camera.getWorldPosition(_camWorldPos);

    // Scale relative to distance from camera.
    const distanceToCamera = _indicatorWorldPos.distanceTo(_camWorldPos);
    scaleObj.scale.setScalar(distanceToCamera);
  });

  if (!controller) return;
  return createPortal(
    <>
      <group rotation={rotation}>
        <Line
          ref={lineRef}
          points={points}
          color={'white'}
          scale={scale}
          lineWidth={2}
        />
        <animated.object3D ref={indicatorRef} scale={spring.indicatorScale}>
          <object3D ref={objRef}>
            <VRHoverIndicator
              handedness={handedness}
              radius={indicatorRadius}
            />
          </object3D>
        </animated.object3D>
      </group>
    </>,
    controller.controller
  );
};
