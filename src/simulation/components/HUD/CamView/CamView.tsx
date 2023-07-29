import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import {
  Box,
  CameraControls,
  PerspectiveCamera,
  View,
} from '@react-three/drei';
import { useActor } from '@xstate/react';
import { useContext, useEffect, useMemo } from 'react';
import { CamViewRenderTarget } from './CamViewRenderTarget';
import { createPortal } from '@react-three/fiber';
import { Scene } from 'three';
import { CamViewScene } from './CamViewScene';

const CamView = () => {
  const { uiService } = useContext(GlobalStateContext);
  const [uiState] = useActor(uiService); // Bind

  // const portalScene = useMemo(() => {
  //   const scene = new Scene();
  //   return scene;
  // }, []);

  if (
    !uiState.context.camViewPortalRef ||
    !uiState.context.camViewPortalRef.current
  ) {
    return;
  }
  return (
    <>
      {/* <View track={uiState.context.camViewPortalRef} index={2}> */}
      <CamViewScene />
      {/* </View> */}
    </>
  );
};
export { CamView };
