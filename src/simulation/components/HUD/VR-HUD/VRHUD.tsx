import { DefaultStyleProvider, RootContainer } from '@coconut-xr/koestlich';
import { VRDetailsPanel } from './vr-details-panel/VRDetailsPanel';
import { VRTimePanel } from './vr-time-panel/VRTimePanel';
import { colors } from './vr-hud-constants';

export const VRHUD = () => {
  return (
    <>
      <>
        <DefaultStyleProvider
          color={colors.foreground}
          borderColor={colors.border}
        >
          <RootContainer>
            <VRDetailsPanel position={[-2, 0, 0]} />
            <VRTimePanel />
          </RootContainer>
        </DefaultStyleProvider>
      </>
    </>
  );
};
