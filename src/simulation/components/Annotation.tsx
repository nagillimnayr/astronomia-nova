import { Html, BBAnchor } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { debugState } from '../state/DebugState';

type AnnotationProps = {
  annotation: string;
};
const Annotation = (props: AnnotationProps) => {
  const debugSnap = useSnapshot(debugState);

  return debugSnap.annotations ? (
    <BBAnchor anchor={[0, -1, 0]}>
      <object3D>
        <Html center className="pointer-events-none min-h-fit min-w-fit">
          <div className="flex min-h-fit min-w-fit translate-y-1/2 select-none flex-row  rounded-lg px-2 text-white">
            {props.annotation}
          </div>
        </Html>
      </object3D>
    </BBAnchor>
  ) : (
    <></>
  );
};

export default Annotation;
