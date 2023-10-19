import { type KeplerBody } from '@/components/canvas/body/kepler-body';
import { PI_OVER_TWO } from '@/constants/constants';
import { colorMap } from '@/helpers/color-map';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useCallback, useMemo, useRef } from 'react';
import {
  type ArrowHelper,
  type Group,
  type Mesh,
  type Object3D,
  Spherical,
  Vector3,
} from 'three';
import { ProjectedTrail } from './ProjectedTrail';
import { Sphere } from '@react-three/drei';

const _pos = new Vector3();
const _otherPos = new Vector3();
const _bodyPos = new Vector3();
const _diff = new Vector3();
const _direction = new Vector3();
const _projectedPos = new Vector3();
const _cameraPos = new Vector3();
const _spherical = new Spherical();

type Props = {
  body: KeplerBody;
  radius: number;
};

export const ProjectedSphere = ({ body, radius }: Props) => {
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const surfaceView = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );

  const targetRef = useRef<Object3D>(null!);
  const markerRef = useRef<Mesh>(null!);
  const pivotRef = useRef<Object3D>(null!);
  const anchorRef = useRef<Group>(null!);
  const arrowRef = useRef<ArrowHelper>(null!);

  const circleArgs: [number, number] = useMemo(() => {
    const radius = 1;
    const segments = 6;
    return [radius, segments];
  }, []);

  if (!body) return;
  const color = colorMap.get(body.name);
  return (
    <>
      <group ref={anchorRef}>
        <ProjectedTrail body={body} length={100} color={color} />
      </group>
    </>
  );
};
