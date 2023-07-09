import { cn } from '~/lib/cn';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
  bodyCode: string;
  ephemerisType: 'elements' | 'vectors';
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
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    // convert data to json format before sending to server
    const jsonData = JSON.stringify(data);
    console.log('data', jsonData);

    // API endpoint to send the data to
    const endpoint = '/horizons';

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data to the server.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'content-type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: jsonData,
    };

    // send the request to the server
    const response = await fetch(endpoint, options);
    console.log('success?:', await response.json());
  };

  // console.log(watch('bodyCode')); // watch input value by passing the name of it

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
        className="w-full rounded-md border-2 px-2 text-center"
        placeholder="body id"
        {...register('bodyCode', { required: true })}
      />

      <div className="rounded-md border-2 p-2">
        <legend className="border-b-2 px-1">Select ephemeris type</legend>
        {/* include validation with required or other standard HTML validation rules */}
        <div className="flex flex-row gap-2">
          <input
            {...register('ephemerisType', { required: true })}
            type="radio"
            value="elements"
            id="elements"
            checked
          />
          <label htmlFor="">Orbital Elements</label>
        </div>

        <div className="flex flex-row gap-2">
          <input
            {...register('ephemerisType', { required: true })}
            type="radio"
            value="vectors"
            id="vectors"
          />
          <label htmlFor="vectors">State Vectors</label>
        </div>
      </div>

      {/* errors will return when field validation fails  */}
      {errors.bodyCode && <span>Body id is required</span>}
      {errors.ephemerisType && <span>Ephemeris type is required</span>}

      <input
        type="submit"
        className="bg-button-primary text-button-primary-foreground hover:bg-button-primary/80 rounded-md border-2 px-2"
      />
    </form>
  );
};

export default EphemerisForm;
