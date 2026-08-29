import type { MetadataRoute } from "next";

/* Required by `output: "export"` — without it the manifest is treated as
   a dynamic route and the static build fails. */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vedas4All Learning Portal",
    short_name: "Vedas4All",
    description:
      "Sanskrit chants with svara marks, meanings, and audio for Vedas4All classes.",
    start_url: "/",
    display: "standalone",
    background_color: "#080B10",
    theme_color: "#080B10",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
