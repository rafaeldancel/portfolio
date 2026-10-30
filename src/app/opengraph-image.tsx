import { ImageResponse } from "next/og";
import { profile, siteContent } from "@/content";

const title = siteContent.heroTitles[0];

export const alt = `${profile.name} · ${title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori cannot read CSS variables; these mirror the globals.css tokens.
const color = { bg: "#0d0d0b", line: "#2a2a26", fg: "#e9e6dd", muted: "#8c897f", accent: "#ffb224" };
const grid = 24;

// Satori does not paint repeating radial gradients, so the site's dot grid is drawn as dots.
const dots = Array.from({ length: Math.ceil(size.height / grid) }, (_, row) =>
  Array.from({ length: Math.ceil(size.width / grid) }, (_, column) => ({ x: column * grid + grid / 2 - 1, y: row * grid + grid / 2 - 1 })),
).flat();

// Google Fonts serves TrueType (which Satori can read) when no browser UA is sent.
// Subsetting to the rendered text keeps each file to a few kB.
async function loadFont(family: string, weight: number, text: string) {
  const query = `family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`No TrueType source for ${family} ${weight}`);
  return (await fetch(url)).arrayBuffer();
}

export default async function OpengraphImage() {
  const [name, light, mono] = await Promise.all([
    loadFont("IBM Plex Sans", 500, profile.name),
    loadFont("IBM Plex Sans", 300, title),
    loadFont("IBM Plex Mono", 400, siteContent.heroLabel),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          padding: "0 96px",
          backgroundColor: color.bg,
          color: color.fg,
        }}
      >
        {dots.map(({ x, y }) => (
          <div key={`${x}-${y}`} style={{ position: "absolute", left: x, top: y, width: 2, height: 2, borderRadius: 1, backgroundColor: color.line }} />
        ))}
        <div style={{ fontFamily: "Plex Mono", fontSize: 22, letterSpacing: "0.08em", color: color.muted }}>
          {siteContent.heroLabel}
        </div>
        <div style={{ marginTop: 28, fontFamily: "Plex Sans", fontWeight: 500, fontSize: 132, lineHeight: 0.95, letterSpacing: "-0.02em" }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 28, fontFamily: "Plex Sans", fontWeight: 300, fontSize: 68, letterSpacing: "-0.02em", color: color.muted }}>
          {title}
          <div style={{ width: 20, height: 50, marginLeft: 8, marginTop: 6, backgroundColor: color.accent }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Plex Sans", data: name, weight: 500, style: "normal" },
        { name: "Plex Sans", data: light, weight: 300, style: "normal" },
        { name: "Plex Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
