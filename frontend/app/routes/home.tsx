import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DuckuMent" },
    { name: "description", content: "Turning council documents into clear, secure, accessible information." },
  ];
}

export default function Home() {
  return <div>Start</div>;
}
