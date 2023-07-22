import * as AlertDialog from '@radix-ui/react-alert-dialog';

const SurfaceViewDialog = () => {
  return (
    <AlertDialog.Overlay className="fixed left-1/2 top-1/2 grid h-60 w-96 max-w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card">
      <AlertDialog.Title>Surface View</AlertDialog.Title>
      <AlertDialog.Description></AlertDialog.Description>
      <AlertDialog.Content className="grid grid-cols-5">
        {/** Cancel button. */}
        <AlertDialog.Cancel asChild>
          <button className="col-span-1 col-start-2 w-16 place-items-center border">
            Cancel
          </button>
        </AlertDialog.Cancel>
        {/** Confirm button. */}
        <AlertDialog.Action asChild>
          <button className="col-span-1 col-end-[-2] w-16 ">Confirm</button>
        </AlertDialog.Action>
      </AlertDialog.Content>
    </AlertDialog.Overlay>
  );
};

export { SurfaceViewDialog };
