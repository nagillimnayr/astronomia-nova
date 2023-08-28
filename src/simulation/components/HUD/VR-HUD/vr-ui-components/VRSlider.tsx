/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Circle, Plane, Ring, useCursor } from '@react-three/drei';
import { useCallback, useMemo, useRef } from 'react';
import {
  type ColorRepresentation,
  DoubleSide,
  type Vector3Tuple,
  type Group,
  type Object3D,
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
  const [stepLength, rangeStart, minX, maxX] = useMemo(() => {
    const length = max - min;
    const stepLength = width / length;

    const halfWidth = width / 2;

    let rangeStart = -halfWidth;
    // If min value is zero or positive, start of slider range will be the left end of the slider.
    // If min is negative, the slider range will start at zero.
    if (min < 0) {
      rangeStart += Math.abs(min) * stepLength;
    }
    // Min and max x pos values in scene units.
    const minX = min * stepLength;
    const maxX = max * stepLength;
    return [stepLength, rangeStart, minX, maxX];
  }, [max, min, width]);

  const [spring, springRef] = useSpring(() => ({
    x: 0,
    onChange: {
      x: (result: AnimationResult<SpringValue<any>>) => {
        if (typeof result !== 'number') return; // Type guard.

        // Convert x pos from pixel coords into range [min, max].
        const value = result / stepLength;
        // console.log('value:', value);

        // Adjust the value to be divisible by the step size.
        const adjusted = Math.floor(value / step) * step;
        // console.log('adjusted:', adjusted);

        // Pass adjusted value to onValueChange callback.
        if (onValueChange) {
          onValueChange(adjusted);
        }
      },
    },
  }));

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
        {/** Plane position such that its left side is at the origin of the parent object. Scaling the parent object then will keep one side at the position of the parent objects origin. */}
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
  const bind = useGesture({
    onDragStart: () => {
      // Record the x position at the start of the current gesture.
      // use-gesture only records the screen coords, as it wasn't designed for use with Three.js, so we need to keep track of the scene coords ourselves.
      const initX = spring.x.get();
      dragStartXPos.current = initX;
    },
    onDrag: (state) => {
      // Get the ratio of the canvas width in pixels to the normalized viewport width.
      // This gives us the number of pixels per one scene unit, so we can convert between screen coords and scene coords.
      const { size, viewport } = getThree();
      const ratio = size.width / viewport.width;

      // The 'movement' value from use-gesture gives the pixel coord offset from the start of the current gesture.
      const [mx] = state.movement; // Retrieve the x component of the vector,
      const moveX = mx / ratio; // Convert to scene units.
      let newX = dragStartXPos.current + moveX; // Calculate new x target.
      newX = clamp(newX, minX, maxX); // Clamp the new x target.
      springRef.start({ x: newX }); // Set new x target.

      /** Alternative that also seems to work: */
      // const [ox] = state.offset;
      // const offsetX = ox / ratio;
      // springRef.start({ x: offsetX - xStart });
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
