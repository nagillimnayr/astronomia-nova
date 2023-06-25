import { proxy } from 'valtio';

type DebugStateObj = {
  boundingBoxes: boolean;
  arrows: boolean;
  annotations: boolean;
  trajectories: boolean;
};
export const debugState = proxy<DebugStateObj>({
  boundingBoxes: false,
  arrows: false,
  annotations: true,
  trajectories: true,
});
