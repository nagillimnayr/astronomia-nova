import { proxy } from 'valtio';

type DebugStateObj = {
  showBoundingBoxes: boolean;
  showArrows: boolean;
};
export const debugState = proxy<DebugStateObj>({
  showBoundingBoxes: false,
  showArrows: false,
});
