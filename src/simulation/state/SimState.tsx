import { Object3D } from 'three';
import { proxy } from 'valtio';
import KeplerBody, { traverseTree } from '../classes/KeplerBody';
//import { OrbitControls, CameraControls } from 'three-stdlib';
import { CameraControls } from '@react-three/drei';
import { RootState } from '@react-three/fiber';
import { camState } from './CamState';
import { makeFixedUpdateFn } from '../systems/FixedTimeStep';
import { DAY } from '../utils/constants';

type SimStateObj = {
  getState: () => RootState;
  updateIteration: number;
};

export const simState = proxy<SimStateObj>({
  getState: null!,
  updateIteration: 0,
});
