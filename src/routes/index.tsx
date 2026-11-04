import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/game/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nhango Storybook — Visual Novel" },
      { name: "description", content: "Visual novel dos livros do Nhango: modo história e sandbox com Livro I, II e III." },
      { property: "og:title", content: "Nhango Storybook — Visual Novel" },
      { property: "og:description", content: "Modo história e sandbox com Livro I, II e III." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});
