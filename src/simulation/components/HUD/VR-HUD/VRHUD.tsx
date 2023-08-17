import { DefaultStyleProvider, RootContainer } from '@coconut-xr/koestlich';
import { VRDetailsPanel } from './vr-details-panel/VRDetailsPanel';
import { VRTimePanel } from './vr-time-panel/VRTimePanel';
import { color } from './vr-hud-constants';

export const VRHUD = () => {
  return (
    <>
      <>
        <DefaultStyleProvider
          color={color.foreground}
          borderColor={color.border}
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
