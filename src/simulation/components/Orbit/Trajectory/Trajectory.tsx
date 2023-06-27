import { CatmullRomLine, Line } from '@react-three/drei';
import { pi } from 'mathjs';
import { useMemo, useRef } from 'react';
import { ArrowHelper, EllipseCurve, Euler, Vector3 } from 'three';
import { getLinearEccentricityFromAxes } from '~/simulation/math/orbital-elements/LinearEccentricity';
import { DIST_MULT } from '~/simulation/utils/constants';
import { useSnapshot } from 'valtio';
import { debugState } from '~/simulation/state/DebugState';
// import { Arrow } from '../arrows/Arrow';

const XUNITVECTOR = new Vector3(1, 0, 0);

type TrajectoryProps = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  linearEccentricity?: number;
};

export const Trajectory = (props: TrajectoryProps) => {
  const linearEccentricity = useMemo(() => {
    return (
      props.linearEccentricity ??
      getLinearEccentricityFromAxes(props.semiMajorAxis, props.semiMinorAxis)
    );
  }, [props.semiMajorAxis, props.semiMinorAxis, props.linearEccentricity]);
  const points = useMemo(() => {
    return new EllipseCurve(
      -linearEccentricity / DIST_MULT,
      0,
      props.semiMajorAxis / DIST_MULT,
      props.semiMinorAxis / DIST_MULT
    ).getSpacedPoints(128);
  }, [props.semiMajorAxis, props.semiMinorAxis, linearEccentricity]);

  const arrowRef = useRef<ArrowHelper>(null!);

  const debug = useSnapshot(debugState);
  return debug.trajectories ? (
    <>
      <object3D rotation={new Euler(Math.PI / 2, 0, 0)}>
        <Line points={points} color={'white'} lineWidth={1} />
        <arrowHelper
          ref={(arrow) => {
            if (!arrow) return;
            arrowRef.current = arrow;
            arrow.setColor('red');
            arrow.position.set(-linearEccentricity / DIST_MULT, 0, 0);
            arrow.setDirection(XUNITVECTOR);
            arrow.setLength(props.semiMajorAxis / DIST_MULT, 1, 0.25);
          }}
        />
      </object3D>
    </>
  ) : (
    <></>
  );
};
