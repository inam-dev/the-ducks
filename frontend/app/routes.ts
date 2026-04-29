import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("components/Layout.tsx", [
		index("routes/home.tsx"),
		route("upload", "routes/upload.tsx"),
		route("processing", "routes/processing.tsx"),
		route("results", "routes/results.tsx"),
	]),
] satisfies RouteConfig;
