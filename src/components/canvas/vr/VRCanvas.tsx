import { Canvas, useThree } from '@react-three/fiber';

import { MachineContext } from '@/state/xstate/MachineProviders';

import { type PropsWithChildren } from 'react';
import { VRManager } from './VRManager';
import { XRCanvas } from '@coconut-xr/natuerlich/defaults';
import { useEnterXR } from '@coconut-xr/natuerlich/react';
import { EnterVRButton } from './EnterVRButton';

const REF_SPACE_TYPE: Readonly<XRReferenceSpaceType> = 'local-floor';

const sessionOptions: XRSessionInit = {
  requiredFeatures: [REF_SPACE_TYPE],
};

export const VRCanvas = ({ children }: PropsWithChildren) => {
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const enterVR = useEnterXR('immersive-vr', sessionOptions);

  return (
    <>
      <div className="relative z-10 h-full w-full touch-none select-none overscroll-none">
        <XRCanvas
          flat
          linear /* Textures will appear washed out unless this is set. */
          gl={{ logarithmicDepthBuffer: true, localClippingEnabled: true }}
        >
          {children}
          <VRManager />
        </XRCanvas>
        <div className="absolute bottom-10 right-20 z-20 h-fit w-fit whitespace-nowrap ">
          <EnterVRButton />
        </div>
      </div>
    </>
  );
};
