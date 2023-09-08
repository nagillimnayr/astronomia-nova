import { METER } from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Projector } from '../projector/Projector';

const DIST_ABOVE_SURFACE: Readonly<number> = 2 * METER; // Meters above surface
// to place the camera.
const Observer = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <>
      <object3D>
        <object3D>
          {/** Position observer 2 meters above the surface. */}
          <object3D
            position-y={DIST_ABOVE_SURFACE}
            name="observer"
            ref={(observer) => {
              if (!observer) return;
              cameraActor.send({ type: 'ASSIGN_OBSERVER', observer });
            }}
          >
            {/* <axesHelper args={[5 * METER]} /> */}
            <Projector />
            {/* <Suspense>
             <SkySphere />
             </Suspense> */}
          </object3D>
          {/* <axesHelper args={[5 * METER]} /> */}
        </object3D>
      </object3D>
    </>
  );
};

export { Observer };