import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { DIST_MULT, EARTH_RADIUS, METER } from '@/simulation/utils/constants';
import {
  MachineContext,
  // RootMachineContext,
} from '@/state/xstate/MachineProviders';
import { useSpring } from '@react-spring/core';
import { animated } from '@react-spring/three';
import { Center, Text, Text3D } from '@react-three/drei';
import { useActor, useSelector } from '@xstate/react';
import { forwardRef, useContext, useEffect, useRef } from 'react';
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

  const textScale = 0.5;

  const [spring, springRef] = useSpring(() => ({
    scale: textScale,
  }));

  useEffect(() => {
    console.log('toggle vis');
    springRef.start({ scale: isVisible ? textScale : 0 });
  }, [isVisible, springRef]);

  const fontURL = 'fonts/Roboto_Regular.json';
  return (
    <>
      <object3D>
        <animated.object3D
          ref={fwdRef}
          position={[0, -(meanRadius * METER), 0]}
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

          <animated.object3D
            scale-x={spring.scale}
            scale-y={spring.scale}
            scale-z={1e-5}
          >
            <Center bottom>
              <Text3D font={fontURL} letterSpacing={0.15}>
                {annotation}
              </Text3D>
            </Center>
          </animated.object3D>
        </animated.object3D>
      </object3D>
    </>
  );
});

export { Annotation };
