import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  layout("components/ProtectedLayout.tsx", [
    index("routes/home.tsx"),
    route("upload", "routes/upload.tsx"),
    route("processing", "routes/processing.tsx"),
    route("results", "routes/results.tsx"),
    route("archive", "routes/archive.tsx"),
  ]),
] satisfies RouteConfig;
