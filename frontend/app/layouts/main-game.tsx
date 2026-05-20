import { Outlet } from "react-router";
import LeftContent from "~/components/content/left-content";
import MainBottomMenu from "~/components/navigation/main-bottom-menu";
import MainTopMenu from "~/components/navigation/main-top-menu";
import { redirect } from "react-router";
import { userContext } from "~/context";
import { useServerFetch } from "~/hooks/useServerFetch";
import type { Route } from "./+types/main-game";
import { useGameStore } from "~/store/gameStore";
import React from "react";

// Client-side timing middleware
async function timingMiddleware({ context }: any, _next: () => any) {
  const { $fetch } = useServerFetch();
  const { success, user } = await $fetch({
    path: "auth/me",
    method: "GET",
    credentials: "include",
  });
  if (!success) {
    throw redirect("/");
  }

  context.set(userContext, user);
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  timingMiddleware,
];

export async function clientLoader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);

  // NOTE: Load user Inventory and Characters
  const baseUrl =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_URL
      : "http://localhost:7893";

  const [charRes, itemRes] = await Promise.all([
    fetch(`${baseUrl}/api/player/characters`, { credentials: "include" }),
    fetch(`${baseUrl}/api/player/inventory`, { credentials: "include" }), // Changed path
  ]);

  const { characters } = await charRes.json();
  const { items } = await itemRes.json();

  return { user, characters, items };
}

export default function MainGameLayout({ loaderData }: Route.ComponentProps) {
  const setCharacters = useGameStore((state) => state.setCharacters);
  const setItems = useGameStore((state) => state.setItems);

  // Sync loader data into our reactive Zustand store
  React.useEffect(() => {
    if (loaderData.characters) setCharacters(loaderData.characters);
    if (loaderData.items) setItems(loaderData.items);
  }, [loaderData.characters, loaderData.items, setCharacters, setItems]);

  // Read data Reactively from the store instead of using static loaderData arrays
  const charactersMap = useGameStore((state) => state.characters);
  const itemsMap = useGameStore((state) => state.items);

  const charactersList = Object.values(charactersMap);
  const itemsList = Object.values(itemsMap);

  return (
    <div className="relative grid grid-cols-3 w-full max-h-screen bg-muted/40 overflow-y-hidden">
      <LeftContent
        user={loaderData.user}
        characters={charactersList} // Hand down reactive state
        items={itemsList}
      />
      <div className="flex flex-col w-full">
        <MainTopMenu />
        <div className="w-full max-h-screen overflow-y-auto">
          <section className="min-h-500">
            <Outlet context={loaderData.user} />
          </section>
        </div>
        <MainBottomMenu />
      </div>
      <div />
    </div>
  );
}
