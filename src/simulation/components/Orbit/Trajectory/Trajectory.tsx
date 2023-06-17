import { CatmullRomLine, Line } from '@react-three/drei';
import { useMemo } from 'react';
import { EllipseCurve } from 'three';
import { LinearEccentricity } from '~/simulation/math/orbital-elements/LinearEccentricity';

type TrajectoryProps = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  linearEccentricity?: number;
};
export const Trajectory = (props: TrajectoryProps) => {
  const points = useMemo(() => {
    const linearEccentricity =
      props.linearEccentricity ??
      LinearEccentricity.fromAxes(props.semiMajorAxis, props.semiMinorAxis);
    return new EllipseCurve(
      -linearEccentricity,
      0,
      props.semiMajorAxis,
      props.semiMinorAxis
    ).getSpacedPoints(64);
  }, [props.semiMajorAxis, props.semiMinorAxis, props.linearEccentricity]);

  return (
    <>
      <CatmullRomLine
        points={points}
        color={'white'}
        curveType="catmullrom"
        lineWidth={0.1}
      />
    </>
  );
};
