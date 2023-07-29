import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import {
  PerspectiveCamera as PerspectiveCam,
  useHelper,
} from '@react-three/drei';
import { useContext, useRef } from 'react';
import { CameraHelper, type Object3D, type PerspectiveCamera } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const Observer = () => {
  const { cameraService } = useContext(GlobalStateContext);

  return (
    <>
      <object3D>
        <object3D rotation={[0, 0, -degToRad(90)]}>
          <object3D
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
