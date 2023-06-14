import { Html } from '~/drei-imports/abstractions/text/Html';

type AnnotationProps = {
  annotation: string;
};
const Annotation = (props: AnnotationProps) => {
  return (
    <Html className="min-h-fit min-w-fit">
      <div className="flex min-h-fit min-w-fit flex-row text-white">
        {props.annotation}
      </div>
    </Html>
  );
};

export default Annotation;
