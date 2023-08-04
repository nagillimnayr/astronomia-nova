import { cn } from '@/lib/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Html } from '@react-three/drei';
import { useActor, useSelector } from '@xstate/react';
import { useContext } from 'react';

type AnnotationProps = {
  annotation: string;
};
const HtmlAnnotation = (props: AnnotationProps) => {
  // Check if annotation visibility is on.

  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const annotations = useSelector(
    visibilityActor,
    ({ context }) => context.annotations
  );
  const isVisible = useSelector(annotations, (state) =>
    state.matches('active')
  );

  return (
    <>
      <Html center className="pointer-events-none min-h-fit min-w-fit">
        <div
          className={cn(
            'flex min-h-fit min-w-fit translate-y-1/2 select-none flex-row rounded-lg px-2 text-white transition-all',
            isVisible ? 'text-white' : 'text-transparent'
          )}
        >
          {props.annotation}
        </div>
      </Html>
    </>
  );
};

export { HtmlAnnotation };
