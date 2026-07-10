const path = require("path");
const { exportDeck } = require("./lib/presentation-export");

// Path to the Astro blog repo, can be overridden with BLOG_REPO_PATH env var
const BLOG_REPO_PATH = process.env.BLOG_REPO_PATH || path.resolve(__dirname, "..", "..", "Blogs", "tech-arch-blog");
const OUT_ROOT = path.join(BLOG_REPO_PATH, "public", "presentations");

async function main() {
  const presentationFolder = process.argv[2];
  const requestedFileName = process.argv[3];
  const rawFormats = process.argv[4];

  if (!presentationFolder) {
    console.error("Usage: npm run publish-presentation -- <presentation-folder-name> [specific-file.md] [formats]");
    console.error("  [specific-file.md] optional, required only if the folder holds more than one deck.");
    console.error("  [formats] optional, comma-separated from html,pdf,pptx (default: html)");
    console.error("  Output goes to <blog-repo>/public/presentations/<folder>/ — served live by Cloudflare Pages.");
    process.exit(1);
  }

  const outDir = await exportDeck({
    presentationFolder,
    requestedFileName,
    rawFormats,
    outRoot: OUT_ROOT,
    npmScriptName: "publish-presentation",
  });

  console.log(`[+] Presentation published: ${outDir}`);
}

main().catch(err => {
  console.error("[-] Failed to publish presentation:", err);
  process.exit(1);
});
