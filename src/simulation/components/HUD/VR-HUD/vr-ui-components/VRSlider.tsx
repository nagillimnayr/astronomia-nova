import { Circle, Plane, Ring, useCursor } from '@react-three/drei';
import { useMemo } from 'react';
import { type ColorRepresentation, DoubleSide, type Vector3Tuple } from 'three';
import { depth } from '../vr-hud-constants';
import useHover from '@/hooks/useHover';
import { type ThreeEvent } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { useSpring, animated } from '@react-spring/three';

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
    console.log('step length:', stepLength);
    console.log('range start:', rangeStart);
    return [stepLength, rangeStart];
  }, [max, min, width]);

  // Get end position of the range.
  const rangeEnd = rangeStart + value * stepLength;

  return (
    <>
      <group position={position}>
        <VRSliderTrack color={trackColor} width={width} height={height} />
        <VRSliderRange
          color={rangeColor}
          height={height}
          xStart={rangeStart}
          xEnd={rangeEnd}
        />

        <VRSliderThumb
          xPos={rangeEnd}
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
  xStart: number;
  xEnd: number;
  height: number;
  color: ColorRepresentation;
};
const VRSliderRange = ({ height, xStart, xEnd, color }: VRSliderRangeProps) => {
  const width = xEnd - xStart;

  return (
    <>
      <object3D position={[xStart, 0, depth.xs]}>
        {/** Plane position such that its left side is at the origin of the parent object. Scaling the parent object then will keep one side at the position of the parent objects origin. */}
        <object3D scale={[width, height, 1]}>
          <Plane position={[0.5, 0, 0]}>
            <meshBasicMaterial color={color} side={DoubleSide} />
          </Plane>
        </object3D>
      </object3D>
    </>
  );
};

const ringArgs: [number, number, number] = [0.95, 1, 64];
const circleArgs: [number, number] = [0.95, 64];
type VRSliderThumbProps = {
  xPos: number;
  radius: number;
  color: ColorRepresentation;
  borderColor: ColorRepresentation;
};
const VRSliderThumb = ({
  xPos,
  radius,
  color,
  borderColor,
}: VRSliderThumbProps) => {
  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered);
  const { scale } = useSpring({ scale: isHovered ? 1.2 : 1 });
  return (
    <>
      <animated.object3D
        position={[xPos, 0, depth.sm]}
        scale={scale}
        onPointerEnter={hoverEvents.handlePointerEnter}
        onPointerLeave={hoverEvents.handlePointerLeave}
      >
        <Interactive
          onHover={hoverEvents.handlePointerEnter}
          onBlur={hoverEvents.handlePointerLeave}
        >
          <group scale={radius}>
            <Ring args={ringArgs} material-color={borderColor} />
            <Circle args={circleArgs} material-color={color} />
          </group>
        </Interactive>
      </animated.object3D>
    </>
  );
};
