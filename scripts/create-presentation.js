const path = require("path");
const { exportDeck } = require("./lib/presentation-export");

const OUT_ROOT = path.join(__dirname, "..", "_site", "src", "presentations");

async function main() {
  const presentationFolder = process.argv[2];
  const requestedFileName = process.argv[3];
  const rawFormats = process.argv[4];

  if (!presentationFolder) {
    console.error("Usage: npm run create-presentation -- <presentation-folder-name> [specific-file.md] [formats]");
    console.error("  [specific-file.md] optional, required only if the folder holds more than one deck.");
    console.error("  [formats] optional, comma-separated from html,pdf,pptx (default: html)");
    console.error("  Output goes to _site/src/presentations/<folder>/ — local preview only, not published to the blog.");
    process.exit(1);
  }

  const outDir = await exportDeck({
    presentationFolder,
    requestedFileName,
    rawFormats,
    outRoot: OUT_ROOT,
    npmScriptName: "create-presentation",
  });

  console.log(`[+] Presentation built locally: ${outDir}`);
}

main().catch(err => {
  console.error("[-] Failed to create presentation:", err);
  process.exit(1);
});
