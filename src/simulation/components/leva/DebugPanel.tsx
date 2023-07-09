import { folder, useControls } from 'leva';
import { debugState } from '@/simulation/state/DebugState';
import Annotation from '../Annotation';
export const DebugPanel = () => {
  const debug = useControls('debug', {
    boundingBoxes: false,
    arrows: false,
    annotations: true,
    trajectories: true,
  });

  debugState.boundingBoxes = debug.boundingBoxes;
  debugState.arrows = debug.arrows;
  debugState.annotations = debug.annotations;
  debugState.trajectories = debug.trajectories;

  return <></>;
};
