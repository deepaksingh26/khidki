import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Khidkee",
    short_name: "Khidkee",
    description: "Community field intelligence platform for grounded outreach work.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF4E8",
    theme_color: "#1C0F00",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
