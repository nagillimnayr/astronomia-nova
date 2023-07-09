import { cn } from '@/lib/cn';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  fileName: string;
  fileContents: string;
};

type FormProps = {
  className?: string;
};
const FSTestForm = ({ className }: FormProps) => {
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

  console.log(watch('fileName')); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'flex h-fit w-fit flex-col items-center justify-start gap-4',
        className
      )}
    >
      {/* register your input into the hook by invoking the "register" function */}
      <input
        className="w-full rounded-md border-2 px-2"
        placeholder="file name"
        defaultValue={''}
        {...register('fileName', { required: true })}
      />

      {/* include validation with required or other standard HTML validation rules */}
      <textarea
        placeholder="file contents"
        className="w-full rounded-md border-2 px-2"
        {...register('fileContents', { required: true })}
      />

      {/* errors will return when field validation fails  */}
      {errors.fileName && <span>This field is required</span>}
      {errors.fileContents && <span>This field is required</span>}

      <input
        type="submit"
        className="bg-button-primary text-button-primary-foreground hover:bg-button-primary/80 rounded-md border-2 px-2"
      />
    </form>
  );
};

export default FSTestForm;
