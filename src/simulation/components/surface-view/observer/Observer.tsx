import { GlobalStateContext } from '@/state/xstate/MachineProviders';

import { useContext } from 'react';

const Observer = () => {
  const { cameraService } = useContext(GlobalStateContext);

  return (
    <>
      <object3D>
        <object3D>
          <object3D
            name="observer"
            ref={(observer) => {
              if (!observer) return;
              cameraService.send({ type: 'ASSIGN_OBSERVER', observer });
            }}
          />
          <axesHelper args={[3e-2]} />
        </object3D>
      </object3D>
    </>
  );
};

export { Observer };
