import { Label } from '@/components/ui/label';

type Props = {
  name: string;
  children: string;
};
export const AttributeDetails = ({ name, children }: Props) => {
  return (
    <>
      <div className="m-0 flex h-fit w-full flex-col items-start justify-start overflow-hidden whitespace-nowrap">
        <Label htmlFor={name} className="text-xs ">
          {name}:
        </Label>
        <span id={name} className="w-full text-right text-xs">
          {children}
        </span>
      </div>
    </>
  );
};
