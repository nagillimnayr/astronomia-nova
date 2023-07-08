import { cn } from '~/lib/cn';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  bodyCode: string;
};

type FormProps = {
  className?: string;
};
const EphemerisForm = ({ className }: FormProps) => {
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

  console.log(watch('bodyCode')); // watch input value by passing the name of it

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
        placeholder="body code"
        defaultValue={''}
        {...register('bodyCode', { required: true })}
      />

      <fieldset className="border-2 p-2">
        <legend className="border-2 px-1">Select ephemeris type</legend>
        {/* include validation with required or other standard HTML validation rules */}
        <div flex="~ row" gap="2" p="1" className="h-fit w-full min-w-fit">
          <input
            type="radio"
            name="ephemeris-type"
            id="elements"
            value="elements"
            checked
          />
          <label htmlFor="elements">Orbital Elements</label>
        </div>

        <div flex="~ row" gap="2" p="1" className="h-fit w-full min-w-fit">
          <input
            type="radio"
            name="ephemeris-type"
            id="vectors"
            value="vectors"
          />
          <label htmlFor="vectors">State Vectors</label>
        </div>
      </fieldset>

      {/* errors will return when field validation fails  */}
      {errors.bodyCode && <span>This field is required</span>}
      {/* {errors.fileContents && <span>This field is required</span>} */}

      <input
        type="submit"
        className="bg-button-primary text-button-primary-foreground hover:bg-button-primary/80 rounded-md border-2 px-2"
      />
    </form>
  );
};

export default EphemerisForm;
