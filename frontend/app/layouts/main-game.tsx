import { Outlet } from "react-router";
import Sidemenu from "~/components/navigation/side-menu";
import Topmenu from "~/components/navigation/top-menu";

export default function MainGameLayout() {
  return (
    <div className="relative flex w-full min-h-screen bg-white">
      <Sidemenu />
      <div className="flex flex-col w-full h-full">
        <Topmenu />
        <Outlet />
      </div>
    </div>
  );
}
