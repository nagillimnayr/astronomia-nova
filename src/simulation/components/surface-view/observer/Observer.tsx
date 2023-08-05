import { MachineContext } from '@/state/xstate/MachineProviders';

const Observer = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <>
      <object3D>
        <object3D>
          <object3D
            name="observer"
            ref={(observer) => {
              if (!observer) return;
              cameraActor.send({ type: 'ASSIGN_OBSERVER', observer });
            }}
          />
          {/* <axesHelper args={[3e-2]} /> */}
        </object3D>
      </object3D>
    </>
  );
};

export { Observer };
