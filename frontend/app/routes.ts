import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("components/Layout.tsx", [
		index("routes/home.tsx"),
		route("upload", "routes/upload.tsx"),
		route("processing", "routes/processing.tsx"),
		route("results", "routes/results.tsx"),
	]),
	index("routes/dashboard.tsx"),
	route("summary", "routes/summary.tsx"),
	route("redaction", "routes/redaction.tsx"),
	route("translation", "routes/translation.tsx"),
	route("handwritten", "routes/handwritten.tsx"),
	route("accessibility", "routes/accessibility.tsx"),
	route("history", "routes/history.tsx"),
] satisfies RouteConfig;
