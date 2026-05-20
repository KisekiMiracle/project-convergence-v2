import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify-icon/react";
import { cn } from "@sglara/cn";
import { CharacterDialog } from "./dialog-character";
import { Progress } from "@base-ui/react/progress";

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
        <div className="px-6 py-4 flex flex-col gap-4">
          {characters.length !== 0 ? (
            characters.map((character: Record<string, any>) => (
              <CharacterCard
                name={character.stats.name}
                stats={character.stats}
                lastName={character.stats.lastName}
                firstMetAt={character.firstMetAt}
                metadata={character.metadata}
              />
            ))
          ) : (
            <div>- No items to show -</div>
          )}
        </div>
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

interface CharacterCardProps {
  name: string;
  lastName: string;
  stats: Record<string, string | number>;
  firstMetAt: Date;
  metadata?: Record<string, any> | null;
}

export function CharacterCard({
  name,
  lastName,
  stats,
  firstMetAt,
  metadata = { rarity: "common" },
}: CharacterCardProps) {
  return (
    <CharacterDialog stats={stats} firstMetAt={firstMetAt}>
      <div className="flex flex-col gap-2 w-full shadow-md shadow-transparent transition-all duration-150 hover:cursor-pointer hover:shadow-neutral-400 rounded-md bg-white p-4">
        <div
          className={
            "flex items-center justify-between w-full gap-1 text-sm font-bold"
          }
        >
          <div className="flex items-center gap-1">
            <span>{name}</span>
            <span>{lastName}</span>
          </div>
          <span className="font-semibold">Level {stats.level}</span>
        </div>
        <div>
          <Progress.Root
            className="grid max-w-full w-full grid-cols-2 gap-y-2"
            value={Math.min(
              100,
              Math.round(
                (Number(stats.experience) / Number(stats.experienceToLvlUp)) *
                  100,
              ),
            )}
          >
            <Progress.Track className="col-span-2 h-1 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <Progress.Indicator className="bg-pink-600 transition-[width] duration-500 dark:bg-white" />
            </Progress.Track>
            <Progress.Label className="text-xs font-normal text-neutral-950 dark:text-white">
              Experience
            </Progress.Label>
            <Progress.Value className="text-right text-xs text-neutral-950 dark:text-white" />
          </Progress.Root>
        </div>
        <div className="grid grid-cols-2 items-center">
          <Progress.Root
            className="grid max-w-full w-60 grid-cols-2 gap-y-2"
            value={Math.min(
              100,
              Math.round(
                (Number(stats.currentHp) / Number(stats.maxHp)) * 100 +
                  Math.random() * 25,
              ),
            )}
          >
            <Progress.Label className="text-sm font-normal text-neutral-950 dark:text-white flex items-center gap-1">
              <Icon icon="game-icons:heart-beats" width="16" height="16" />
              Health Points
            </Progress.Label>
            <Progress.Value className="text-right text-sm text-neutral-950 dark:text-white" />
            <Progress.Track className="col-span-2 h-1 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <Progress.Indicator className="bg-emerald-600 transition-[width] duration-500 dark:bg-white" />
            </Progress.Track>
            <small>
              {stats.currentHp} / {stats.maxHp}
            </small>
          </Progress.Root>
          <Progress.Root
            className="grid max-w-full w-60 grid-cols-2 gap-y-2"
            value={Math.min(
              100,
              Math.round(
                (Number(stats.currentMp) / Number(stats.maxMp)) * 100 +
                  Math.random() * 25,
              ),
            )}
          >
            <Progress.Label className="text-sm font-normal text-neutral-950 dark:text-white flex items-center gap-1">
              <Icon icon="game-icons:magic-potion" width="16" height="16" />
              Mana Points
            </Progress.Label>
            <Progress.Value className="text-right text-sm text-neutral-950 dark:text-white" />
            <Progress.Track className="col-span-2 h-1 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <Progress.Indicator className="bg-blue-600 transition-[width] duration-500 dark:bg-white" />
            </Progress.Track>
            <small>
              {stats.currentMp} / {stats.maxMp}
            </small>
          </Progress.Root>
        </div>
      </div>
    </CharacterDialog>
  );
}
