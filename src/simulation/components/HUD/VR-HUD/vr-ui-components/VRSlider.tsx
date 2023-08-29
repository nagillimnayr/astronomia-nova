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
  type MutableRefObject,
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
  Vector3,
  type Mesh,
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
  type AnimationResult,
} from '@react-spring/three';
import { useGesture } from '@use-gesture/react';
import { clamp } from 'three/src/math/MathUtils';
import { ORIGIN, Z_AXIS } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { CameraControls } from 'three-stdlib';
import { VRIconButton } from './VRIconButton';

const _camWorldPos = new Vector3();
const _thumbWorldPos = new Vector3();

export type VRSliderProps = {
  position?: Vector3Tuple;
  incrementers?: boolean; // Whether or not to add incrementer buttons to the side of the slider.
  value: number;
  min: number;
  max: number;
  step: number;
  width: number;
  height: number;
  thumbRadius: number;
  trackColor?: ColorRepresentation;
  fillColor?: ColorRepresentation;
  thumbColor?: ColorRepresentation;
  thumbBorderColor?: ColorRepresentation;

  onValueChange?: (value: number) => void;
};
export const VRSlider = ({
  position,
  incrementers,
  width,
  height,
  value,
  min,
  max,
  step,
  thumbRadius,
  trackColor = 'black',
  fillColor = 'white',
  thumbColor = 'white',
  thumbBorderColor = 'black',
  onValueChange,
}: VRSliderProps) => {
  value = clamp(value, min, max);
  const stepSize = useRef<number>(0); // Size of step increments.
  const stepLength = useRef<number>(0); // Length in scene units per step.
  stepSize.current = step; // Store in ref so that updates to the value will be accessible in callbacks.

  // Compute measurements based on width of slider and range of values.
  const [startX, minX, maxX, halfWidth] = useMemo(() => {
    if (max <= min) {
      console.error('Error: max is less than or equal to min.');
    }
    const range = max - min; // Size of the range of values from min to max.
    stepLength.current = width / range; // Length in scene units between each value in the range.

    const halfWidth = width / 2;

    let startX = -halfWidth; // X position of either zero, or the min value if greater than zero.
    // If min value is zero or positive, start of slider fill range will be the left end of the slider.
    // If min is negative, the slider fill range will start at zero.
    if (min < 0) {
      startX += Math.abs(min) * stepLength.current;
    }
    // Min and max x pos values in scene units.
    const minX = min * stepLength.current;
    const maxX = max * stepLength.current;
    return [startX, minX, maxX, halfWidth];
  }, [max, min, width]);

  const [spring, springRef] = useSpring(() => ({
    // Convert value into scene units.
    x: value * stepLength.current,
    onChange: {
      x: (result: AnimationResult<SpringValue<any>>) => {
        if (typeof result !== 'number') return; // Type guard.

        // Convert x pos from scene units into range [min, max].
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

  // Callback for the slider to update the value.
  const setX = useCallback(
    (x: number) => {
      const newX = clamp(x, minX, maxX); // Clamp the new x target.
      springRef.start({ x: newX }); // Set new x target.
    },
    [maxX, minX, springRef]
  );
  // Callback for the incrementers to increment the value.
  const incrementValue = useCallback(
    (value: number) => {
      const springX = spring.x.get();
      // Convert to scene units.
      const amount = value * stepLength.current;
      const newX = clamp(springX + amount, minX, maxX); // Clamp the new x target.
      springRef.start({ x: newX }); // Set new x target.
    },
    [maxX, minX, spring.x, springRef]
  );

  // Ref to intersection plane.
  const planeRef = useRef<Mesh>(null!);
  const intersectionPlaneWidth = width + thumbRadius * 4;
  const intersectionPlaneHeight = (height + thumbRadius) * 6;

  // Runs whenever minX or maxX are changed, and clamps the target x value.
  useEffect(() => {
    const springX = spring.x.get();
    if (springX < minX || springX > maxX) {
      const newX = clamp(springX, minX, maxX);
      springRef.set({ x: newX });
    }
  }, [maxX, minX, spring, springRef]);

  // Calculate x position of incrementer buttons.
  const incrementerPos = 1.25 * height + halfWidth + thumbRadius;

  return (
    <>
      <group position={position}>
        <VRSliderTrack
          spring={spring}
          // springRef={springRef}
          trackColor={trackColor}
          fillColor={fillColor}
          width={width}
          height={height}
          startX={startX}
          setX={setX}
        />
        {/* <VRSliderRange
          spring={spring}
          color={fillColor}
          height={height}
          startX={rangeStart}
        /> */}
        <VRSliderThumb
          spring={spring}
          // springRef={springRef}
          startX={startX}
          // minX={minX}
          // maxX={maxX}
          radius={thumbRadius}
          color={thumbColor}
          borderColor={thumbBorderColor}
          planeRef={planeRef}
          setX={setX}
        />
        <VRSliderIntersectionPlane
          width={intersectionPlaneWidth}
          height={intersectionPlaneHeight}
          ref={planeRef}
        />
        {/** Conditionally render increment buttons. */}
        {incrementers && (
          <>
            {/** Decrement button. */}
            <VRSliderIncrementer
              decrement
              position={[-incrementerPos, 0, depth.xs]}
              height={height}
              step={step}
              incrementValue={incrementValue}
            />
            {/** Increment button. */}
            <VRSliderIncrementer
              position={[incrementerPos, 0, depth.xs]}
              height={height}
              step={step}
              incrementValue={incrementValue}
            />
          </>
        )}
      </group>
    </>
  );
};

type VRSliderTrackProps = {
  spring: { x: SpringValue<number> };
  // springRef: SpringRef<{ x: number }>;
  width: number;
  height: number;
  startX: number;
  trackColor: ColorRepresentation;
  fillColor: ColorRepresentation;
  setX: (value: number) => void;
};
const VRSliderTrack = ({
  spring,
  // springRef,
  width,
  height,
  startX,
  trackColor,
  fillColor,
  setX: setValue,
}: VRSliderTrackProps) => {
  const trackRef = useRef<Mesh>(null!);
  const anchorRef = useRef<Object3D>(null!);
  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      const point = event.point;
      anchorRef.current.worldToLocal(point); // Get in local coords.

      // const newX = clamp(point.x, minX, maxX); // Clamp the new x target.
      // springRef.start({ x: newX }); // Set new x target.
      setValue(point.x);
    },
    [setValue]
  );

  return (
    <>
      <group>
        {/** Track. */}
        <Plane
          name="slider-track"
          ref={trackRef}
          scale={[width, height, 1]}
          material-color={trackColor}
          onClick={handleClick}
        />

        {/** Filled Track. */}
        <object3D ref={anchorRef} position={[startX, 0, depth.xs]}>
          {/** Position plane such that its left side is at the origin of the parent object. Scaling the parent object then will keep one side at the position of the parent objects origin. */}
          <animated.object3D
            scale-y={height}
            scale-x={spring.x} // Animate the horizontal scale.
          >
            <Plane name="slider-track-filled" position={[0.5, 0, 0]}>
              <meshBasicMaterial color={fillColor} side={DoubleSide} />
            </Plane>
          </animated.object3D>
        </object3D>
      </group>
    </>
  );
};

const ringArgs: [number, number, number] = [0.95, 1, 64];
const circleArgs: [number, number] = [0.95, 64];
type VRSliderThumbProps = {
  spring: { x: SpringValue<number> };
  // springRef: SpringRef<{ x: number }>;
  startX: number;
  // minX: number;
  // maxX: number;
  radius: number;
  color: ColorRepresentation;
  borderColor: ColorRepresentation;
  planeRef: MutableRefObject<Mesh>;
  setX: (value: number) => void;
};
const VRSliderThumb = ({
  spring,
  // springRef,
  startX,
  // minX, // Min x pos value in scene units.
  // maxX, // Max x pos value in scene units.
  radius,
  color,
  borderColor,
  planeRef,
  setX: setValue,
}: VRSliderThumbProps) => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
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
      // Record the x position at the start of the current gesture.
      // use-gesture only records the screen coords, as it wasn't designed for use with Three.js, so we need to keep track of the scene coords ourselves.
      const initX = spring.x.get();
      dragStartXPos.current = initX;
      // console.log('drag start x pos:', initX);

      pointerDown.current = true;
      cameraActor.send({ type: 'LOCK_CONTROLS' });

      const controls = getThree().controls as CameraControls;
      if ('enabled' in controls && typeof controls.enabled === 'boolean') {
        controls.enabled = false;
      }
    },
    onDragEnd: () => {
      pointerDown.current = false;
      // console.log('drag end');
      cameraActor.send({ type: 'UNLOCK_CONTROLS' });
      const controls = getThree().controls as CameraControls;
      if ('enabled' in controls && typeof controls.enabled === 'boolean') {
        controls.enabled = true;
      }
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
      anchorRef.current.worldToLocal(point); // Get in local coords.
      // console.log('x:', point.x);
      // console.log('startX:', startX);
      // const newX = clamp(point.x, minX, maxX); // Clamp the new x target.
      // springRef.start({ x: newX }); // Set new x target.

      setValue(point.x);
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
  // const boxHelper = useHelper(planeRef, BoxHelper);

  useImperativeHandle(fwdRef, () => planeRef.current);

  return (
    <>
      <Plane scale={[width, height, 1]} ref={planeRef}>
        <MeshDiscardMaterial />
      </Plane>
    </>
  );
});

type VRSliderIncrementerProps = {
  position?: Vector3Tuple;
  decrement?: boolean;
  height: number;
  step: number;
  incrementValue: (value: number) => void;
};
const VRSliderIncrementer = ({
  position,
  decrement,
  height,
  step,
  incrementValue,
}: VRSliderIncrementerProps) => {
  const handleClick = useCallback(() => {
    const amount = decrement ? -step : step;
    incrementValue(amount);
  }, [decrement, incrementValue, step]);

  const iconSrc = decrement
    ? 'icons/MdiChevronLeft.svg'
    : 'icons/MdiChevronRight.svg';
  return (
    <>
      <object3D position={position} scale={height}>
        <VRIconButton iconSrc={iconSrc} onClick={handleClick} />
      </object3D>
    </>
  );
};
