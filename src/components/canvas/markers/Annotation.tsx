import { METER } from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSpring } from '@react-spring/core';
import { animated } from '@react-spring/three';
import { Center, Text3D } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { forwardRef, useEffect } from 'react';
import { type Object3D } from 'three';

type AnnotationProps = {
  annotation: string;
  meanRadius: number;
};
const Annotation = forwardRef<Object3D, AnnotationProps>(function Annotation(
  { annotation, meanRadius }: AnnotationProps,
  fwdRef
) {
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

  const textScale = 0.5;

  const [spring, springRef] = useSpring(() => ({
    scale: textScale,
  }));

  // Effect will run whenever isVisible changes.
  useEffect(() => {
    // Animate scale to hide the object.
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
          <animated.object3D
            scale-x={spring.scale}
            scale-y={spring.scale}
            scale-z={1e-5}
          >
            <Center bottom>
              {/* There are issues with the transparency of the Troika text, but using 3D text geometry solves those issues. */}
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
