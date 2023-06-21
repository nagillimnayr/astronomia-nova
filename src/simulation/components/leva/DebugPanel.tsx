import { folder, useControls } from 'leva';
import { debugState } from '~/simulation/state/DebugState';
export const DebugPanel = () => {
  const debug = useControls('debug', {
    showBoundingBoxes: false,
    showArrows: false,
  });

  debugState.showBoundingBoxes = debug.showBoundingBoxes;
  debugState.showArrows = debug.showArrows;

  return <></>;
};
