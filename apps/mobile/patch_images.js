const fs = require("fs");
const path = require("path");

const filesToPatch = [
  "apps/mobile/components/home/sections/SpotlightRow.tsx",
  "apps/mobile/components/home/sections/SwarmRow.tsx",
  "apps/mobile/components/home/sections/VertRow.tsx",
  "apps/mobile/components/home/sections/WatchHistoryRow.tsx",
  "apps/mobile/components/home/sections/WideRow.tsx",
];

for (const filePath of filesToPatch) {
  let content = fs.readFileSync(filePath, "utf8");

  // Patch Image style
  content = content.replace(
    /<Image\s+source=\{\{ uri: [^}]+\}\}\s+style=\{StyleSheet.absoluteFill\}/g,
    (match) =>
      match.replace(
        "style={StyleSheet.absoluteFill}",
        'style={[StyleSheet.absoluteFill, { width: "100%", height: "100%", zIndex: 1 }]}',
      ),
  );

  // Patch Image style if it's spread or different
  content = content.replace(
    /<Image[\s\S]*?style=\{StyleSheet.absoluteFill\}[\s\S]*?\/>/g,
    (match) => {
      if (match.includes("zIndex")) return match; // already patched
      return match.replace(
        "style={StyleSheet.absoluteFill}",
        'style={[StyleSheet.absoluteFill, { width: "100%", height: "100%", zIndex: 1 }]}',
      );
    },
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Patched ${filePath}`);
}
