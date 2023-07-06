import { cn } from '~/lib/cn';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  example: string;
  exampleRequired: string;
};

type FormProps = {
  className?: string;
};

const TestForm = ({ className }: FormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    console.log(data);
    alert(JSON.stringify(data));
  };

  console.log(watch('example')); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'container flex h-fit w-fit flex-col items-center justify-start gap-4',
        className
      )}
    >
      {/* register your input into the hook by invoking the "register" function */}
      <input
        className="rounded-md border-2 px-2"
        placeholder="test"
        defaultValue={''}
        {...register('example')}
      />

      {/* include validation with required or other standard HTML validation rules */}
      <input
        className="rounded-md border-2 px-2"
        {...register('exampleRequired', { required: true })}
      />

      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input
        type="submit"
        className="bg-button-primary text-button-primary-foreground hover:bg-button-primary/80 rounded-md border-2 px-2"
      />
    </form>
  );
};

export default TestForm;
