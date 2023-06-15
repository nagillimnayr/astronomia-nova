import { Html } from '~/drei-imports/abstractions/text/Html';
import { BBAnchor } from '~/drei-imports/staging/BBAnchor';

type AnnotationProps = {
  annotation: string;
};
const Annotation = (props: AnnotationProps) => {
  return (
    <BBAnchor anchor={[0, -1, 0]}>
      <Html center className="min-h-fit min-w-fit ">
        <div className="flex min-h-fit min-w-fit translate-y-1/2 select-none flex-row  rounded-lg px-2 text-white">
          {props.annotation}
        </div>
      </Html>
    </BBAnchor>
  );
};

export default Annotation;
