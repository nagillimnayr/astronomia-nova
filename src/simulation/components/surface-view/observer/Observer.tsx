import { DIST_MULT, METER } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';

const DIST_ABOVE_SURFACE: Readonly<number> = 2 * METER; // 2 meters above surface.
const Observer = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <>
      <object3D>
        <object3D>
          {/** Position observer 2 meters above the surface. */}
          <object3D
            position={[0, DIST_ABOVE_SURFACE, 0]}
            name="observer"
            ref={(observer) => {
              if (!observer) return;
              cameraActor.send({ type: 'ASSIGN_OBSERVER', observer });
            }}
          >
            <axesHelper args={[1e-3]} />
          </object3D>
          <axesHelper args={[3e-2]} />
        </object3D>
      </object3D>
    </>
  );
};

export { Observer };
