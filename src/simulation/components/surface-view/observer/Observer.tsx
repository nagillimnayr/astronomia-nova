import { GlobalStateContext } from '@/state/xstate/MachineProviders';

import { useContext, useRef } from 'react';
import { degToRad } from 'three/src/math/MathUtils';

const Observer = () => {
  const { cameraService } = useContext(GlobalStateContext);

  return (
    <>
      <object3D>
        <object3D rotation={[0, 0, -degToRad(90)]}>
          <object3D
            name="Observer"
            ref={(observer) => {
              if (!observer) return;
              // if (observer === cameraService.machine.context.observer) return;
              cameraService.send({ type: 'ASSIGN_OBSERVER', observer });
            }}
          />
        </object3D>
        <axesHelper args={[3e-2]} />
      </object3D>
    </>
  );
};

export { Observer };
