import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify-icon/react";
import { cn } from "@sglara/cn";

interface Props {
  user: Record<string, any>;
  items: Record<string, any>;
  characters: Record<string, any>;
}

export default function LeftContent({ user, items, characters }: Props) {
  return (
    <Tabs defaultValue="account" className="w-full flex items-center relative">
      <TabsList className="w-full">
        <TabsTrigger value="inventory">
          <Icon icon="mdi:bag-personal" width="24" height="24" />
          <span>Inventory</span>
        </TabsTrigger>
        <TabsTrigger value="characters">
          <Icon icon="mdi:person-group" width="24" height="24" />
          <span>Characters</span>
        </TabsTrigger>
      </TabsList>
      <TabEntry value="inventory">
        <div className="px-6 py-4 flex flex-col gap-4">
          {items.length !== 0 ? (
            items.map((item: Record<string, any>) => (
              <Item
                name={item.name}
                description={item.description}
                amount={item.amount}
                category={item.category}
                icon={item.icon}
                metadata={item.metadata}
              />
            ))
          ) : (
            <div>- No items to show -</div>
          )}
        </div>
      </TabEntry>
      <TabEntry value="characters">
        <div className="h-fit">Make changes to your account here.</div>
      </TabEntry>
    </Tabs>
  );
}

interface TabEntryProps {
  children: React.ReactElement;
  value: string;
}

function TabEntry({ children, value }: TabEntryProps) {
  return (
    <TabsContent
      value={value}
      className="bg-muted/40 w-full max-h-screen overflow-y-auto "
    >
      <section>{children}</section>
    </TabsContent>
  );
}

interface ItemProps {
  name: string;
  description: string;
  amount: number;
  category: "consumable" | "key" | "equip";
  icon?: string;
  metadata?: Record<string, any> | null;
}

export function Item({
  name,
  description,
  amount,
  category,
  icon = "mdi:bag-personal",
  metadata = { rarity: "common" },
}: ItemProps) {
  return (
    <div className="flex flex-col gap-2 w-full shadow-md shadow-transparent transition-all duration-150 hover:cursor-pointer hover:shadow-neutral-400 rounded-md bg-white p-4">
      <div
        className={cn("flex items-center gap-1 text-sm font-bold", {
          "text-blue-700": metadata!.rarity === "uncommon",
        })}
      >
        <Icon icon={icon} width="18" height="18" />
        <span>{name}</span>
        <small>x{amount}</small>
      </div>
      <p className="text-xs">{description}</p>
    </div>
  );
}
