import { Outlet } from "react-router";
import LeftContent from "~/components/content/left-content";
import MainBottomMenu from "~/components/navigation/main-bottom-menu";
import MainTopMenu from "~/components/navigation/main-top-menu";
import { redirect } from "react-router";
import { userContext } from "~/context";
import { useServerFetch } from "~/hooks/useServerFetch";
import type { Route } from "./+types/main-game";

// Client-side timing middleware
async function timingMiddleware({ context }: any, next: () => any) {
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
  return { user };
}

export default function MainGameLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="relative grid grid-cols-3 w-full max-h-screen bg-muted/40 overflow-y-hidden">
      <LeftContent user={loaderData.user} />
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
