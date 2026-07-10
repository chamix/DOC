const fs = require("fs");
const path = require("path");
const { marpCli } = require("@marp-team/marp-cli");

const PRESENTATIONS_DIR = path.join(__dirname, "..", "..", "src", "presentations");
const THEMES_DIR = path.join(PRESENTATIONS_DIR, "_themes");

const VALID_FORMATS = ["html", "pdf", "pptx"];

function resolveMdFileName(srcDir, requestedFileName, npmScriptName) {
  const mdFiles = fs.readdirSync(srcDir).filter(f => f.endsWith(".md") && !f.startsWith("_"));

  if (mdFiles.length === 0) {
    console.error(`[-] No slide .md files found in ${srcDir}`);
    process.exit(1);
  }

  // No specific file requested: keep the original single-deck behavior.
  if (!requestedFileName) {
    if (mdFiles.length === 1) {
      return mdFiles[0];
    }
    console.error(`[-] Found ${mdFiles.length} .md files in ${srcDir}, so I don't know which one to publish:`);
    mdFiles.forEach(f => console.error(`      - ${f}`));
    console.error(`[-] Re-run with the specific file name as a third argument, e.g.:`);
    console.error(`      npm run ${npmScriptName} -- ${path.basename(srcDir)} ${mdFiles[0]}`);
    process.exit(1);
  }

  // Specific file requested: accept it with or without the .md extension.
  const normalized = requestedFileName.endsWith(".md") ? requestedFileName : `${requestedFileName}.md`;

  if (!mdFiles.includes(normalized)) {
    console.error(`[-] "${normalized}" not found in ${srcDir}. Available files:`);
    mdFiles.forEach(f => console.error(`      - ${f}`));
    process.exit(1);
  }

  return normalized;
}

function resolveThemeName(content) {
  const match = content.match(/^theme:\s*(.+?)\s*\r?\n?$/m);
  return match ? match[1].trim() : null;
}

function parseFormats(rawFormats) {
  if (!rawFormats) return ["html"];

  const formats = rawFormats.split(",").map(f => f.trim().toLowerCase());
  const invalid = formats.filter(f => !VALID_FORMATS.includes(f));

  if (invalid.length > 0) {
    console.error(`[-] Unknown format(s): ${invalid.join(", ")}. Valid formats: ${VALID_FORMATS.join(", ")}`);
    process.exit(1);
  }

  return formats;
}

async function exportFormat(mdPath, themePath, outPath, format) {
  const args = [mdPath, "-o", outPath, "--theme-set", themePath, "--allow-local-files"];
  if (format === "pptx") args.push("--pptx");

  const exitStatus = await marpCli(args);

  if (exitStatus > 0) {
    console.error(`[-] marp-cli failed exporting ${format} (exit status ${exitStatus})`);
    process.exit(1);
  }
}

// Shared core: resolves the deck, validates its theme, exports the requested
// formats into outRoot/<presentationFolder>/, and copies the local img/
// folder alongside as a safety net for the html output.
async function exportDeck({ presentationFolder, requestedFileName, rawFormats, outRoot, npmScriptName }) {
  const srcDir = path.join(PRESENTATIONS_DIR, presentationFolder);
  if (!fs.existsSync(srcDir)) {
    console.error(`[-] Presentation folder not found: ${srcDir}`);
    process.exit(1);
  }

  const mdFileName = resolveMdFileName(srcDir, requestedFileName, npmScriptName);
  const mdPath = path.join(srcDir, mdFileName);
  const content = fs.readFileSync(mdPath, "utf-8");

  const themeName = resolveThemeName(content);
  if (!themeName) {
    console.error(`[-] No "theme:" directive found in the frontmatter of ${mdFileName}`);
    process.exit(1);
  }

  const themePath = path.join(THEMES_DIR, `${themeName}.css`);
  if (!fs.existsSync(themePath)) {
    console.error(`[-] Theme file not found: ${themePath}`);
    process.exit(1);
  }

  const formats = parseFormats(rawFormats);
  const outDir = path.join(outRoot, presentationFolder);
  fs.mkdirSync(outDir, { recursive: true });

  for (const format of formats) {
    const outFile = format === "html" ? "index.html" : `deck.${format}`;
    const outPath = path.join(outDir, outFile);

    console.log(`[i] Exporting ${format.toUpperCase()} -> ${outPath}`);
    await exportFormat(mdPath, themePath, outPath, format);
    console.log(`[+] Exported ${format}: ${outPath}`);
  }

  const imgSrcDir = path.join(srcDir, "img");
  if (fs.existsSync(imgSrcDir)) {
    const imgOutDir = path.join(outDir, "img");
    fs.mkdirSync(imgOutDir, { recursive: true });
    fs.cpSync(imgSrcDir, imgOutDir, { recursive: true });
    console.log(`[+] Copied images: ${imgSrcDir} -> ${imgOutDir}`);
  }

  return outDir;
}

module.exports = { PRESENTATIONS_DIR, THEMES_DIR, exportDeck };
