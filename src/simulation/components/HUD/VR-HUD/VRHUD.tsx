import { DefaultStyleProvider, RootContainer } from '@coconut-xr/koestlich';
import { VRDetailsPanel } from './vr-details-panel/VRDetailsPanel';
import { VRTimePanel } from './vr-time-panel/VRTimePanel';
import { colors } from './vr-hud-constants';
import { VROutliner } from './vr-outliner/VROutliner';
import { type Vector3Tuple } from 'three';

type VRHUDProps = {
  position?: Vector3Tuple;
};
export const VRHUD = ({ position = [0, 0, 0] }: VRHUDProps) => {
  return (
    <>
      <>
        <DefaultStyleProvider
          color={colors.foreground}
          borderColor={colors.border}
        >
          <RootContainer position={position}>
            <VRDetailsPanel position={[2, 0, 0]} />
            <VRTimePanel position={[0, -1, 0]} />
            <VROutliner position={[-2, 0, 0]} />
          </RootContainer>
        </DefaultStyleProvider>
      </>
    </>
  );
};
