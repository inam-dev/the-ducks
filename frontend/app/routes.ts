import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	index("routes/dashboard.tsx"),
	route("upload", "routes/upload.tsx"),
	route("summary", "routes/summary.tsx"),
	route("redaction", "routes/redaction.tsx"),
	route("translation", "routes/translation.tsx"),
	route("handwritten", "routes/handwritten.tsx"),
	route("accessibility", "routes/accessibility.tsx"),
	route("history", "routes/history.tsx"),
] satisfies RouteConfig;
