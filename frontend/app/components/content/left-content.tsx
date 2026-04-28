import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify-icon/react";

interface Props {
  user: Record<string, any>;
}
export default function LeftContent({ user }: Props) {
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
        <>
          <div>Make changes to your account here.</div>
          <div>{JSON.stringify(user)}</div>
        </>
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
