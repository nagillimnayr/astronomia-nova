import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { DIST_MULT, EARTH_RADIUS, METER } from '@/simulation/utils/constants';
import {
  MachineContext,
  // RootMachineContext,
} from '@/state/xstate/MachineProviders';
import { Center, Text, Text3D } from '@react-three/drei';
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

  const fontURL = 'fonts/Roboto_Regular.json';
  return (
    <>
      <object3D>
        <object3D
          ref={fwdRef}
          position={[0, -(meanRadius * METER), 0]}
          // position={[0, -10, 0]}
        >
          {/* <Text
            visible={isVisible}
            color={'white'}
            anchorX={'center'}
            anchorY={'top'}
            outlineColor={'black'}
            outlineWidth={0.005}
            material-transparent={false}
            fillOpacity={1}
            outlineOpacity={1}
            strokeOpacity={1}
          >
            {annotation}
          </Text> */}

          <object3D scale={0.5} scale-z={1e-5}>
            <Center bottom>
              <Text3D visible={isVisible} font={fontURL} letterSpacing={0.15}>
                {annotation}
              </Text3D>
            </Center>
          </object3D>
        </object3D>
      </object3D>
    </>
  );
});

export { Annotation };
