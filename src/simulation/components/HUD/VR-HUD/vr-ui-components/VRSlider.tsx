/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Circle,
  MeshDiscardMaterial,
  Plane,
  Ring,
  useCursor,
  useHelper,
} from '@react-three/drei';
import {
  MutableRefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  type ColorRepresentation,
  DoubleSide,
  type Vector3Tuple,
  type Group,
  type Object3D,
  Plane as IntersectionPlane,
  PlaneHelper,
  Vector3,
  Mesh,
  BoxHelper,
} from 'three';
import { depth } from '../vr-hud-constants';
import useHover from '@/hooks/useHover';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import {
  useSpring,
  animated,
  type SpringValue,
  type SpringRef,
  AnimationResult,
} from '@react-spring/three';
import { useGesture } from '@use-gesture/react';
import { clamp } from 'three/src/math/MathUtils';
import { ORIGIN, Z_AXIS } from '@/simulation/utils/constants';

const _camWorldPos = new Vector3();
const _thumbWorldPos = new Vector3();

export type VRSliderProps = {
  position?: Vector3Tuple;
  value: number;
  min: number;
  max: number;
  step: number;
  width: number;
  height: number;
  thumbRadius: number;
  trackColor?: ColorRepresentation;
  rangeColor?: ColorRepresentation;
  thumbColor?: ColorRepresentation;
  thumbBorderColor?: ColorRepresentation;

  onValueChange?: (value: number) => void;
};
export const VRSlider = ({
  position,
  width,
  height,
  value,
  min,
  max,
  step,
  thumbRadius,
  trackColor = 'black',
  rangeColor = 'white',
  thumbColor = 'white',
  thumbBorderColor = 'black',
  onValueChange,
}: VRSliderProps) => {
  const stepSize = useRef<number>(0); // Size of step increments.
  const stepLength = useRef<number>(0); // Length in scene units per step.
  stepSize.current = step;
  const [rangeStart, minX, maxX] = useMemo(() => {
    const length = max - min;
    stepLength.current = width / length;

    const halfWidth = width / 2;

    let rangeStart = -halfWidth;
    // If min value is zero or positive, start of slider range will be the left end of the slider.
    // If min is negative, the slider range will start at zero.
    if (min < 0) {
      rangeStart += Math.abs(min) * stepLength.current;
    }
    // Min and max x pos values in scene units.
    const minX = min * stepLength.current;
    const maxX = max * stepLength.current;
    return [rangeStart, minX, maxX];
  }, [max, min, width]);

  const [spring, springRef] = useSpring(() => ({
    x: value,
    onChange: {
      x: (result: AnimationResult<SpringValue<any>>) => {
        if (typeof result !== 'number') return; // Type guard.

        // Convert x pos from pixel coords into range [min, max].
        const value = result / stepLength.current;
        // console.log('value:', value);

        // Adjust the value to be divisible by the step size.
        const adjusted =
          Math.round(value / stepSize.current) * stepSize.current;
        // console.log('adjusted:', adjusted);

        // Pass adjusted value to onValueChange callback.
        if (onValueChange) {
          onValueChange(adjusted);
        }
      },
    },
  }));

  // Ref to intersection plane.
  const planeRef = useRef<Mesh>(null!);
  const intersectionPlaneWidth = width + thumbRadius * 4;
  const intersectionPlaneHeight = (height + thumbRadius) * 6;

  useEffect(() => {
    const springX = spring.x.get();
    if (springX < minX || springX > maxX) {
      const newX = clamp(springX, minX, maxX);
      springRef.set({ x: newX });
    }
  }, [maxX, minX, spring, springRef]);

  return (
    <>
      <group position={position}>
        <VRSliderTrack color={trackColor} width={width} height={height} />
        <VRSliderRange
          spring={spring}
          color={rangeColor}
          height={height}
          startX={rangeStart}
        />

        <VRSliderThumb
          spring={spring}
          springRef={springRef}
          startX={rangeStart}
          minX={minX}
          maxX={maxX}
          radius={thumbRadius}
          color={thumbColor}
          borderColor={thumbBorderColor}
          planeRef={planeRef}
        />
        <VRSliderIntersectionPlane
          width={intersectionPlaneWidth}
          height={intersectionPlaneHeight}
          ref={planeRef}
        />
      </group>
    </>
  );
};

type VRSliderTrackProps = {
  width: number;
  height: number;

  color: ColorRepresentation;
};
const VRSliderTrack = ({ width, height, color }: VRSliderTrackProps) => {
  return (
    <>
      <Plane scale={[width, height, 1]} material-color={color} />
    </>
  );
};

type VRSliderRangeProps = {
  spring: { x: SpringValue<number> };
  startX: number;
  height: number;
  color: ColorRepresentation;
};
const VRSliderRange = ({
  spring,
  height,
  startX,
  color,
}: VRSliderRangeProps) => {
  return (
    <>
      <object3D position={[startX, 0, depth.xs]}>
        {/** Position plane such that its left side is at the origin of the parent object. Scaling the parent object then will keep one side at the position of the parent objects origin. */}
        <animated.object3D scale-x={spring.x} scale-y={height}>
          <Plane position={[0.5, 0, 0]}>
            <meshBasicMaterial color={color} side={DoubleSide} />
          </Plane>
        </animated.object3D>
      </object3D>
    </>
  );
};

const ringArgs: [number, number, number] = [0.95, 1, 64];
const circleArgs: [number, number] = [0.95, 64];
type VRSliderThumbProps = {
  spring: { x: SpringValue<number> };
  springRef: SpringRef<{ x: number }>;
  startX: number;
  minX: number;
  maxX: number;
  radius: number;
  color: ColorRepresentation;
  borderColor: ColorRepresentation;
  planeRef: MutableRefObject<Mesh>;
};
const VRSliderThumb = ({
  spring,
  springRef,
  startX,
  minX, // Min x pos value in scene units.
  maxX, // Max x pos value in scene units.
  radius,
  color,
  borderColor,
  planeRef,
}: VRSliderThumbProps) => {
  const getThree = useThree(({ get }) => get);
  const thumbRef = useRef<Object3D>(null!);
  const anchorRef = useRef<Group>(null!);
  // Spring scale on hover.
  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered);
  const { scale } = useSpring({ scale: isHovered ? 1.2 : 1 });

  // Ref for recording the x position at the start of a drag gesture.
  const dragStartXPos = useRef<number>(startX);

  const pointerDown = useRef<boolean>(false);

  const bind = useGesture({
    onDragStart: (state) => {
      const { initial } = state;
      const { camera, raycaster, pointer, size, viewport } = getThree();
      camera.getWorldPosition(_camWorldPos); // Get camera world position.
      const thumb = thumbRef.current;
      thumb.getWorldPosition(_thumbWorldPos); // Get world position of thumb.
      const distanceToOrigin = _thumbWorldPos.distanceTo(ORIGIN);

      const plane = planeRef.current;
      const prevFirstHit = raycaster.firstHitOnly;
      raycaster.firstHitOnly = true;
      const intersections = raycaster.intersectObject(plane);
      if (intersections.length < 1) return;

      // Record the x position at the start of the current gesture.
      // use-gesture only records the screen coords, as it wasn't designed for use with Three.js, so we need to keep track of the scene coords ourselves.
      const initX = spring.x.get();
      dragStartXPos.current = initX;
      console.log('drag start x pos:', initX);

      pointerDown.current = true;
    },
    onDragEnd: () => {
      pointerDown.current = false;
      console.log('drag end');
    },
    onDrag: (state) => {
      // Get the ratio of the canvas width in pixels to the normalized viewport width.
      // This gives us the number of pixels per one scene unit, so we can convert between screen coords and scene coords.
      // const { size, viewport } = getThree();
      // const ratio = size.width / viewport.aspect;
      // // console.log('size.width', size.width);
      // // console.log('viewport.width', viewport.width);
      // // The 'movement' value from use-gesture gives the pixel coord offset from the start of the current gesture.
      // const [mx] = state.movement; // Retrieve the x component of the vector,
      // const moveX = mx / ratio; // Convert to scene units.
      // console.log('mx:', mx);
      // console.log('ratio:', ratio);
      // console.log('moveX:', moveX);
      // let newX = dragStartXPos.current + moveX; // Calculate new x target.
      // newX = clamp(newX, minX, maxX); // Clamp the new x target.
      // springRef.start({ x: newX }); // Set new x target.
      // console.log('dragStartXPos:', dragStartXPos.current);
      // console.log('newX:', newX);

      /** Alternative that also seems to work: */
      // const [ox] = state.offset;
      // const offsetX = ox / ratio;
      // springRef.start({ x: offsetX - xStart });

      const { camera, raycaster, pointer } = getThree();
      // Get intersection with plane.
      raycaster.setFromCamera(pointer, camera);
      const plane = planeRef.current;
      const prevFirstHit = raycaster.firstHitOnly;
      raycaster.firstHitOnly = true;
      const intersections = raycaster.intersectObject(plane);
      if (intersections.length < 1) {
        raycaster.firstHitOnly = prevFirstHit;
        return;
      }
      const intersection = intersections[0];
      if (!intersection) {
        raycaster.firstHitOnly = prevFirstHit;
        return;
      }
      const point = intersection.point;
      // console.log('x:', point.x);
      // console.log('startX:', startX);
      const newX = clamp(point.x - startX, minX, maxX); // Clamp the new x target.
      springRef.start({ x: newX }); // Set new x target.
      // console.log('newX:', newX);

      raycaster.firstHitOnly = prevFirstHit;
    },
  });

  return (
    <>
      <group ref={anchorRef} position={[startX, 0, depth.sm]}>
        {/* @ts-ignore */}
        <animated.object3D
          ref={thumbRef}
          position-x={spring.x}
          {...bind()}
          onPointerEnter={hoverEvents.handlePointerEnter}
          onPointerLeave={hoverEvents.handlePointerLeave}
        >
          <Interactive
            onHover={hoverEvents.handlePointerEnter}
            onBlur={hoverEvents.handlePointerLeave}
          >
            {/* <planeHelper args={[intersectionPlane]} /> */}
            <animated.group scale={scale}>
              <group scale={radius}>
                <Ring args={ringArgs} material-color={borderColor} />
                <Circle args={circleArgs} material-color={color} />
              </group>
            </animated.group>
          </Interactive>
        </animated.object3D>
      </group>
    </>
  );
};

type VRSliderIntersectionPlaneProps = {
  width: number;
  height: number;
};
const VRSliderIntersectionPlane = forwardRef<
  Mesh,
  VRSliderIntersectionPlaneProps
>(function VRSliderIntersectionPlane(
  { width, height }: VRSliderIntersectionPlaneProps,
  fwdRef
) {
  const planeRef = useRef<Mesh>(null!);
  const boxHelper = useHelper(planeRef, BoxHelper);

  useImperativeHandle(fwdRef, () => planeRef.current);

  return (
    <>
      <Plane scale={[width, height, 1]} ref={planeRef}>
        <MeshDiscardMaterial />
      </Plane>
    </>
  );
});
