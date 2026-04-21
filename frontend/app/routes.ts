import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/home.tsx", [index("./routes/page.tsx")]),
  layout("./layouts/main-game.tsx", [route("/play", "./routes/main/home.tsx")]),
] satisfies RouteConfig;
