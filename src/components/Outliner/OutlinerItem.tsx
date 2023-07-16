import type KeplerBody from '@/simulation/classes/KeplerBody';
import * as Accordion from '@radix-ui/react-accordion';

type OutlinerItemProps = {
  body: Readonly<KeplerBody>;
};
const OutlinerItem = ({ body }: OutlinerItemProps) => {
  return (
    <Accordion.Root
      type="multiple"
      className="m-0 flex h-fit min-h-fit w-36 flex-col items-center justify-start rounded-none text-center"
    >
      <Accordion.Item value={body.name} className="m-0 h-fit w-full p-0">
        <Accordion.Header className="m-0 h-fit w-full p-0">
          <Accordion.Trigger className="m-0 flex h-full min-h-fit w-full flex-col items-start justify-center overflow-hidden whitespace-nowrap p-0 hover:bg-subtle">
            <h3 className="m-0 h-fit w-fit p-1 text-left font-sans font-medium text-muted-foreground">
              {body.name}
            </h3>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="m-0 flex h-fit max-h-fit min-h-fit w-full flex-col items-start justify-start gap-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
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
