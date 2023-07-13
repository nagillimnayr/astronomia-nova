import KeplerBody from '@/simulation/classes/KeplerBody';
import * as Accordion from '@radix-ui/react-accordion';

type OutlinerItemProps = {
  body: Readonly<KeplerBody>;
};
const OutlinerItem = ({ body }: OutlinerItemProps) => {
  return (
    <Accordion.Root
      type="multiple"
      className="flex h-12 min-h-fit w-28 w-full flex-col items-center justify-start rounded-md border-2 text-center"
    >
      <Accordion.Item value={body.name} className="h-fit w-full">
        <Accordion.Header className="prose h-fit w-full hover:bg-muted">
          <Accordion.Trigger className="flex h-full w-full flex-col items-center justify-center border hover:bg-muted">
            <h3 className="w-full border-b text-center">{body.name}</h3>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="min-h-fit w-full border data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {body.orbitingBodies.map((child, index) => {
            // recursively traverse the tree to construct the outliner
            return <OutlinerItem key={index} body={child} />;
          })}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default OutlinerItem;
