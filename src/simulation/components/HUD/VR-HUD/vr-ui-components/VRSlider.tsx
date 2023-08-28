/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Circle, Plane, Ring, useCursor } from '@react-three/drei';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  type ColorRepresentation,
  DoubleSide,
  type Vector3Tuple,
  Group,
  Object3D,
} from 'three';
import { depth } from '../vr-hud-constants';
import useHover from '@/hooks/useHover';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import {
  useSpring,
  animated,
  SpringValue,
  useSpringValue,
  SpringRef,
} from '@react-spring/three';
import { useDrag, useGesture } from '@use-gesture/react';
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
  const [stepLength, rangeStart] = useMemo(() => {
    const length = max - min;
    const stepLength = width / length;

    const halfWidth = width / 2;

    let rangeStart = -halfWidth;
    // If min value is zero or positive, start of slider range will be the left end of the slider.
    // If min is negative, the slider range will start at zero.
    if (min < 0) {
      rangeStart += Math.abs(min) * stepLength;
    }

    return [stepLength, rangeStart];
  }, [max, min, width]);

  const handleValueChange = useCallback(
    (value: number) => {
      const newValue = clamp(value / stepLength, min, max);
      if (onValueChange) {
        onValueChange(value);
      }
    },
    [max, min, onValueChange, stepLength]
  );

  const [spring, springRef] = useSpring(() => ({
    x: 0,
    onChange: {
      x: (result) => {
        // console.log('onChange x result:', result);
        const newX = result as unknown as number;
        console.log('onChange newX:', newX);
        const value = newX / stepLength;
        console.log('value:', value);
        // if (onValueChange) {
        //   onValueChange(newX);
        // }
      },
    },
  }));

  // Get end position of the range.
  const rangeEnd = rangeStart + value * stepLength;

  return (
    <>
      <group position={position}>
        <VRSliderTrack color={trackColor} width={width} height={height} />
        <VRSliderRange
          spring={spring}
          springRef={springRef}
          color={rangeColor}
          height={height}
          xStart={rangeStart}
          xEnd={spring.x}
        />

        <VRSliderThumb
          spring={spring}
          springRef={springRef}
          xStart={rangeStart}
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
  springRef: SpringRef<{ x: number }>;
  xStart: number;
  xEnd: SpringValue<number>;
  height: number;
  color: ColorRepresentation;
};
const VRSliderRange = ({
  spring,
  springRef,
  height,
  xStart,
  xEnd,
  color,
}: VRSliderRangeProps) => {
  return (
    <>
      <object3D position={[xStart, 0, depth.xs]}>
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
  xStart: number;
  radius: number;
  color: ColorRepresentation;
  borderColor: ColorRepresentation;
};
const VRSliderThumb = ({
  spring,
  springRef,
  xStart,
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

  const [dragStartXPos, setDragStartXPos] = useState<number>(0);

  const bind = useGesture(
    {
      onDragStart: () => {
        const initX = spring.x.get();
        setDragStartXPos(initX);
        console.log('drag start');
      },
      onDrag: (state) => {
        const { size, viewport } = getThree();
        const aspect = size.width / viewport.width;
        const [ox] = state.offset;
        const offsetX = ox / aspect;
        // const newX = (dragStartXPos + offsetX);
        console.log('dragStartXPos:', dragStartXPos);
        // console.log('oX:', ox);
        console.log('offset X:', offsetX);

        springRef.start({ x: offsetX - xStart });
      },
    },
    {
      drag: {
        // from: ({ initial }) => [initial[0], 0],
      },
    }
  );

  return (
    <>
      <group ref={anchorRef} position={[xStart, 0, depth.sm]}>
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
