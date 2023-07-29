import { cn } from '@/lib/cn';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { Html } from '@react-three/drei';
import { useActor } from '@xstate/react';
import { useContext } from 'react';

type AnnotationProps = {
  annotation: string;
};
const HtmlAnnotation = (props: AnnotationProps) => {
  // Check if annotation visibility is on.
  const { annotationVis } = useContext(GlobalStateContext);
  const [state] = useActor(annotationVis);
  const isVisible = state.matches('active');

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
