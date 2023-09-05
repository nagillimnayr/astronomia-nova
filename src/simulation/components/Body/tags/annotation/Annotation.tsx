import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import {
  MachineContext,
  // RootMachineContext,
} from '@/state/xstate/MachineProviders';
import { Text } from '@react-three/drei';
import { useActor, useSelector } from '@xstate/react';
import { forwardRef, useContext, useRef } from 'react';
import { type Object3D, Vector3 } from 'three';

type AnnotationProps = {
  annotation: string;
  meanRadius: number;
};
const Annotation = forwardRef<Object3D, AnnotationProps>(function Annotation(
  { annotation, meanRadius }: AnnotationProps,
  fwdRef
) {
  const { visibilityActor, cameraActor } = MachineContext.useSelector(
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
      <object3D>
        <object3D
          ref={fwdRef}
          position={[0, -(meanRadius / DIST_MULT), 0]}
          // position={[0, -10, 0]}
        >
          <Text
            visible={isVisible}
            color={'white'}
            anchorX={'center'}
            anchorY={'top'}
            outlineColor={'black'}
            outlineWidth={0.005}
            material-transparent={false}
          >
            {annotation}
          </Text>
        </object3D>
      </object3D>
    </>
  );
});

export { Annotation };
