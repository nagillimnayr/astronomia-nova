import { CatmullRomLine, Line } from '@react-three/drei';
import { useMemo } from 'react';
import { EllipseCurve } from 'three';
import { LinearEccentricity } from '~/simulation/math/orbital-elements/LinearEccentricity';
import { DIST_MULT } from '~/simulation/utils/constants';

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
      -linearEccentricity / DIST_MULT,
      0,
      props.semiMajorAxis / DIST_MULT,
      props.semiMinorAxis / DIST_MULT
    ).getSpacedPoints(64);
  }, [props.semiMajorAxis, props.semiMinorAxis, props.linearEccentricity]);
  console.log('semi-major axis: ', props.semiMajorAxis);
  console.log('semi-minor axis: ', props.semiMinorAxis);
  return (
    <>
      <Line
        points={points}
        color={'white'}
        // curveType="catmullrom"
        lineWidth={0.25}
      />
    </>
  );
};
