import { Circle, Plane } from '@react-three/drei';
import { useMemo } from 'react';
import {
  BufferAttribute,
  ColorRepresentation,
  DoubleSide,
  DynamicDrawUsage,
  Vector3Tuple,
} from 'three';
import { depth } from '../vr-hud-constants';

type VRSliderProps = {
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
          color={thumbColor}
          xPos={rangeEnd}
          radius={thumbRadius}
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
  console.log('xStart:', xStart);
  console.log('xEnd:', xEnd);
  console.log('range width:', width);
  return (
    <>
      <object3D position={[xStart, 0, depth.xs]}>
        <object3D scale={[width, height, 1]}>
          <Plane position={[0.5, 0, 0]}>
            <meshBasicMaterial color={color} side={DoubleSide} />
          </Plane>
        </object3D>
      </object3D>
    </>
  );
};

type VRSliderThumbProps = {
  xPos: number;
  radius: number;
  color: ColorRepresentation;
};
const VRSliderThumb = ({ xPos, radius, color }: VRSliderThumbProps) => {
  return (
    <>
      <group position={[xPos, 0, depth.sm]}>
        <Circle scale={radius} material-color={color} />
      </group>
    </>
  );
};
