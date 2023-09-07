/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEventListener } from '@react-hooks-library/core';
import {
  animated,
  type AnimationResult,
  type SpringValue,
  useSpring,
} from '@react-spring/three';
import { MeshDiscardMaterial, Plane } from '@react-three/drei';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import {
  Interactive,
  useXR,
  useXREvent,
  type XRController,
  type XRInteractionEvent,
} from '@react-three/xr';
import {
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
  type Group,
  type Mesh,
  type Object3D,
  Vector3,
  type Vector3Tuple,
} from 'three';
import { type CameraControls } from 'three-stdlib';
import { clamp } from 'three/src/math/MathUtils';
import {
  colors,
  depth,
  twColors,
} from '../../../../../../constants/vr-hud-constants';
import { VRIconButton } from '../VRIconButton';

const _rayWorldPosition = new Vector3();
const _rayWorldDirection = new Vector3();

export type VRSliderProps = {
  position?: Vector3Tuple;
  incrementers?: boolean; // Whether or not to add incrementer buttons to the
  // side of the slider.
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
  thumbDragColor?: ColorRepresentation;
  thumbBorderDragColor?: ColorRepresentation;

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
  thumbColor = colors.foreground,
  thumbBorderColor = colors.border,
  // thumbDragColor = twColors.gray[300],
  thumbDragColor = twColors.indigo[300],
  thumbBorderDragColor = twColors.indigo[200],
  onValueChange,
}: VRSliderProps) => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const getThree = useThree(({ get }) => get);
  const getXR = useXR(({ get }) => get);
  value = clamp(value, min, max);
  const stepSize = useRef<number>(0); // Size of step increments.
  const stepLength = useRef<number>(0); // Length in scene units per step.
  stepSize.current = step; // Store in ref so that updates to the value will be
  // accessible in callbacks.

  // Compute measurements based on width of slider and range of values.
  const [startX, minX, maxX, halfWidth] = useMemo(() => {
    if (max <= min) {
      console.error('Error: max is less than or equal to min.');
    }
    const range = max - min; // Size of the range of values from min to max.
    stepLength.current = width / range; // Length in scene units between each
    // value in the range.

    const halfWidth = width / 2;

    let startX = -halfWidth; // X position of either zero, or the min value if
    // greater than zero.
    // If min value is zero or positive, start of slider fill range will be the
    // left end of the slider. If min is negative, the slider fill range will
    // start at zero.
    if (min < 0) {
      startX += Math.abs(min) * stepLength.current;
    }
    // Min and max x pos values in scene units.
    const minX = min * stepLength.current;
    const maxX = max * stepLength.current;
    return [startX, minX, maxX, halfWidth];
  }, [max, min, width]);

  const [spring, springRef] = useSpring(() => ({
    value: 0,
    thumbScale: 1,
    thumbColor: thumbColor.toString(),
    thumbBorderColor: thumbBorderColor.toString(),

    onChange: {
      value: (result: AnimationResult<SpringValue<any>>) => {
        if (typeof result !== 'number') return; // Type narrowing.

        // Pass value to onValueChange callback.
        if (onValueChange) {
          // Adjust the value to be divisible by the step size.
          const newValue =
            Math.round(result / stepSize.current) * stepSize.current;
          onValueChange(newValue);
        }
      },
    },
  }));

  // Convert the value that was passed in as a prop into a spring value.
  const { currentX } = useSpring({
    // Convert value into scene units.
    currentX: value * stepLength.current,
  });

  const setValue = useCallback(
    (newValue: number) => {
      newValue = clamp(newValue, min, max); // Clamp the new x target.

      // Adjust the value to be divisible by the step size.
      // newValue =
      //   Math.round(newValue / stepSize.current) * stepSize.current;

      springRef.start({ value: newValue }); // Set new x target.
    },
    [max, min, springRef]
  );
  // Callback for the slider to update the value.
  const setX = useCallback(
    (x: number) => {
      // Convert x pos from scene units into range [min, max].
      const newValue = x / stepLength.current;
      setValue(newValue);
    },
    [setValue]
  );
  // Callback for the incrementers to increment the value.
  const incrementValue = useCallback(
    (decrement?: boolean) => {
      const springValue = spring.value.get();
      const newValue =
        springValue + (decrement ? -stepSize.current : stepSize.current);

      setValue(newValue);
    },
    [setValue, spring]
  );

  // Ref to intersection plane.
  const planeRef = useRef<Mesh>(null!);
  const intersectionPlaneWidth = width + thumbRadius * 4;
  const intersectionPlaneHeight = (height + thumbRadius) * 6;

  // Runs whenever min or max are changed, and clamps the target value.
  useEffect(() => {
    const springValue = spring.value.get();
    if (springValue < min || springValue > max) {
      const newValue = clamp(springValue, min, max);
      springRef.start({ value: newValue });
    }
  }, [max, min, spring, springRef]);

  const isDragging = useRef<boolean>(false);
  const anchorRef = useRef<Object3D>(null!);
  const controllerRef = useRef<XRController>(null!);

  const handleDrag = useCallback(() => {
    if (!isDragging.current) return;

    const { camera, raycaster, pointer } = getThree();

    // Check if we're in a VR session.
    const { isPresenting, controllers } = getXR();
    if (isPresenting) {
      const controller = controllerRef.current;

      if (!controller) {
        return;
      }

      const ray = controller.controller;

      ray.getWorldPosition(_rayWorldPosition);
      ray.getWorldDirection(_rayWorldDirection);
      _rayWorldDirection.multiplyScalar(-1); // Reverse direction.

      raycaster.set(_rayWorldPosition, _rayWorldDirection);
    } else {
      // Set raycaster from pointer and camera.
      raycaster.setFromCamera(pointer, camera);
    }
    // Get intersection with plane.
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
    raycaster.firstHitOnly = prevFirstHit;

    anchorRef.current.worldToLocal(point); // Get in local coords.

    setX(point.x);
  }, [getThree, getXR, setX]);

  const handleDragStart = useCallback(
    (event?: ThreeEvent<PointerEvent> | XRInteractionEvent) => {
      if (event && 'stopPropagation' in event) {
        event.stopPropagation();
      } else if (event) {
        //If triggered by XR controller, keep track of which controller started
        // the drag.
        controllerRef.current = event.target;
      }

      isDragging.current = true;

      // Transition thumb color.
      springRef.start({
        thumbColor: thumbDragColor.toString(),
        thumbBorderColor: thumbBorderDragColor.toString(),
        thumbScale: 1.25,
      });

      // lock camera controls while dragging.
      cameraActor.send({ type: 'LOCK_CONTROLS' });
      const controls = getThree().controls as CameraControls;
      if (
        controls &&
        'enabled' in controls &&
        typeof controls.enabled === 'boolean'
      ) {
        controls.enabled = false;
      }
    },
    [cameraActor, getThree, springRef, thumbBorderDragColor, thumbDragColor]
  );
  const handleDragEnd = useCallback(() => {
    isDragging.current = false;

    // Transition thumb color.
    springRef.start({
      thumbColor: thumbColor.toString(), // Reset color.
      thumbBorderColor: thumbBorderColor.toString(), // Reset color.
      thumbScale: 1, // Reset scale.
    });

    // Unlock camera controls.
    cameraActor.send({ type: 'UNLOCK_CONTROLS' });
    const controls = getThree().controls as CameraControls;
    if (
      controls &&
      'enabled' in controls &&
      typeof controls.enabled === 'boolean'
    ) {
      controls.enabled = true;
    }
  }, [cameraActor, getThree, springRef, thumbColor]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    handleDragEnd();
  }, [handleDragEnd]);

  useXREvent('selectend', (event) => {
    // End drag if controller ended select.
    if (event.target === controllerRef.current) {
      handlePointerUp();
    }
  });

  const handleHover = useCallback(() => {
    springRef.start({
      thumbScale: 1.25,
      thumbColor: thumbDragColor.toString(),
      thumbBorderColor: thumbBorderDragColor.toString(),
    });
  }, [springRef, thumbDragColor]);
  const handleHoverEnd = useCallback(() => {
    // Only reset the scale and color if the thumb is not currently being
    // dragged.
    isDragging.current ||
      springRef.start({
        thumbScale: 1,
        thumbColor: thumbColor.toString(),
        thumbBorderColor: thumbBorderColor.toString(),
      });
  }, [springRef, thumbColor]);

  useEventListener('pointerup', handlePointerUp);

  useFrame(() => {
    handleDrag();
  });

  // Calculate x position of incrementer buttons.
  const incrementerPos = 1.25 * height + halfWidth + thumbRadius;

  return (
    <>
      <group position={position}>
        <object3D name="anchor" ref={anchorRef} position-x={startX} />

        <VRSliderTrack
          trackColor={trackColor}
          fillColor={fillColor}
          width={width}
          height={height}
          startX={startX}
          currentX={currentX}
          setX={setX}
        />

        <VRSliderThumb
          startX={startX}
          currentX={currentX}
          radius={thumbRadius}
          scale={spring.thumbScale}
          color={spring.thumbColor}
          borderColor={spring.thumbBorderColor}
          onDragStart={handleDragStart}
          onDragEnd={handlePointerUp}
          onHover={handleHover}
          onHoverEnd={handleHoverEnd}
        />
        <VRSliderIntersectionPlane
          ref={planeRef}
          width={intersectionPlaneWidth}
          height={intersectionPlaneHeight}
        />
        {/** Conditionally render increment buttons. */}
        {incrementers && (
          <>
            <group position-z={depth.xs}>
              {/** Decrement button. */}
              <VRSliderIncrementer
                decrement
                position={[-incrementerPos, 0, 0]}
                height={height}
                incrementValue={incrementValue}
              />
              {/** Increment button. */}
              <VRSliderIncrementer
                position={[incrementerPos, 0, 0]}
                height={height}
                incrementValue={incrementValue}
              />
            </group>
          </>
        )}
      </group>
    </>
  );
};

type VRSliderTrackProps = {
  width: number;
  height: number;
  startX: number;
  currentX: SpringValue<number>;
  trackColor: ColorRepresentation;
  fillColor: ColorRepresentation;
  setX: (value: number) => void;
};
const VRSliderTrack = ({
  width,
  height,
  startX,
  currentX,
  trackColor,
  fillColor,
  setX,
}: VRSliderTrackProps) => {
  const trackRef = useRef<Mesh>(null!);
  const anchorRef = useRef<Object3D>(null!);
  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      let point: Vector3 = null!;
      if ('stopPropagation' in event) {
        event.stopPropagation();
        point = event.point;
      } else {
        if (!event.intersection) return;
        point = event.intersection.point;
      }
      anchorRef.current.worldToLocal(point); // Get in local coords.

      // const newX = clamp(point.x, minX, maxX); // Clamp the new x target.
      // springRef.start({ x: newX }); // Set new x target.
      setX(point.x);
    },
    [setX]
  );

  return (
    <>
      <group>
        {/** Track. */}
        <Interactive onSelect={handleClick}>
          <Plane
            name="slider-track"
            ref={trackRef}
            scale={[width, height, 1]}
            material-color={trackColor}
            onClick={handleClick}
          />
        </Interactive>

        {/** Filled Track. */}
        <object3D ref={anchorRef} position={[startX, 0, depth.xxs / 2]}>
          {/** Position plane such that its left side is at the origin of the parent object. Scaling the parent object then will keep one side at the position of the parent objects origin. */}
          <animated.object3D
            scale-y={height}
            // scale-x={spring.x} // Animate the horizontal scale.
            scale-x={currentX} // Set the horizontal scale.
          >
            <Plane name="slider-track-filled" position-x={0.5}>
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
  startX: number;
  currentX: SpringValue<number>;
  radius: number;
  scale: number | SpringValue<number>;
  color: ColorRepresentation | SpringValue<string>;
  borderColor: ColorRepresentation | SpringValue<string>;
  onDragStart: () => void;
  onDragEnd: () => void;
  onHover: () => void;
  onHoverEnd: () => void;
};
const VRSliderThumb = ({
  startX,
  currentX,
  radius,
  scale,
  color,
  borderColor,
  onDragStart,
  onDragEnd,
  onHover,
  onHoverEnd,
}: VRSliderThumbProps) => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const getThree = useThree(({ get }) => get);

  const thumbRef = useRef<Object3D>(null!);
  const anchorRef = useRef<Group>(null!);

  return (
    <>
      <group ref={anchorRef} position={[startX, 0, depth.xxs]}>
        <animated.object3D ref={thumbRef} position-x={currentX}>
          <animated.group scale={scale}>
            <group scale={radius}>
              <Interactive
                onHover={onHover}
                onBlur={onHoverEnd}
                onSelectStart={onDragStart}
              >
                {/** Ring. */}
                <animated.mesh material-color={borderColor}>
                  <ringGeometry args={ringArgs} />
                </animated.mesh>
                {/** Circle. */}
                <animated.mesh
                  material-color={color}
                  onPointerDown={onDragStart}
                  onPointerUp={onDragEnd}
                  onPointerMissed={onDragEnd}
                  onPointerEnter={onHover}
                  onPointerLeave={onHoverEnd}
                >
                  <circleGeometry args={circleArgs} />
                </animated.mesh>
              </Interactive>
            </group>
          </animated.group>
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

  useImperativeHandle(fwdRef, () => planeRef.current);

  return (
    <>
      <Plane scale={[width, height, 1]} ref={planeRef}>
        <MeshDiscardMaterial />
        {/* <Edges scale={1} color={'yellow'} /> */}
      </Plane>
    </>
  );
});

type VRSliderIncrementerProps = {
  position?: Vector3Tuple;
  decrement?: boolean;
  height: number;
  incrementValue: (decrement?: boolean) => void;
};
const VRSliderIncrementer = ({
  position,
  decrement,
  height,
  incrementValue,
}: VRSliderIncrementerProps) => {
  const handleClick = useCallback(() => {
    incrementValue(decrement);
  }, [decrement, incrementValue]);

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
