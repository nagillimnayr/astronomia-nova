import { proxy } from 'valtio';

type DebugStateObj = {
  showBoundingBoxes: boolean;
};
export const debugState = proxy<DebugStateObj>({
  showBoundingBoxes: false,
});
