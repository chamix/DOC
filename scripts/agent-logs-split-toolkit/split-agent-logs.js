#!/usr/bin/env node
/**
 * split-agent-logs.js
 *
 * Corta RUN_LOG.md (una fila = una tarea) y DEVLOG.md (una sección `## ` =
 * una entrada) en archivos individuales, y arma un bundle curado por post
 * de la serie "md-view: la historia", listo para subir a cada conversación.
 *
 * Uso:
 *   node split-agent-logs.js --source <carpeta-con-RUN_LOG/DEVLOG/specs> --out <carpeta-destino> --handoff <ruta-a-la-nota-de-handoff.md>
 *
 * Por defecto: --source .  --out ./research-split  (sin --handoff, ese bundle queda marcado como pendiente)
 *
 * Espera encontrar, dentro de --source:
 *   metrics/RUN_LOG.md
 *   DEVLOG.md
 *   specs/review_report_task*.md  (+ specs/review_report.md)
 *   specs/decisions/ADR-*.md
 *   specs/backlog.md
 *
 * Si el mapeo de posts cambia (ej. se confirma el 7mo post "bonus"),
 * editar POST_MAP abajo y volver a correr — es idempotente.
 *
 * IMPORTANTE: la salida contiene material interno de investigación
 * (logs crudos de agentes). No está pensada para el repo público —
 * mantenerla en una carpeta gitignoreada (ej. `_agent-logs-local/`),
 * siguiendo la misma convención que el resto de las notas internas.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------- config --

const args = process.argv.slice(2);
function getArg(flag, def) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
}

const SRC = getArg('--source', '.');
const OUT = getArg('--out', './research-split');

const HANDOFF = getArg('--handoff', null);

const PATHS = {
  runLog: path.join(SRC, 'metrics', 'RUN_LOG.md'),
  devLog: path.join(SRC, 'DEVLOG.md'),
  reviewDir: path.join(SRC, 'specs'),
  adrDir: path.join(SRC, 'specs', 'decisions'),
  backlog: path.join(SRC, 'specs', 'backlog.md'),
  handoff: HANDOFF,
  outRaw: path.join(OUT, 'raw'),
  outPosts: path.join(OUT, 'posts'),
};

// Mapeo de posts — mirror de la tabla en _notes-md-view-series.md.
// Editar acá si la estructura de la serie cambia.
const POST_MAP = [
  {
    n: 1, slug: 'post-1-apertura-dia-0',
    tasks: [1, 4],
    devlogMatches: [],
    adrs: [],
    includeBacklog: false,
    includeHandoff: true, // handoff §1, §4 — génesis y Task 4
  },
  {
    n: 2, slug: 'post-2-reviewer-bash',
    tasks: [14],
    devlogMatches: ['task-14'],
    adrs: [],
    includeBacklog: false,
    includeHandoff: true, // handoff §7 — ángulo original del incidente
  },
  {
    n: 3, slug: 'post-3-tentacion-de-apurar',
    tasks: [],
    devlogMatches: ['tentacion-de-apurar'],
    adrs: [],
    includeBacklog: false,
    includeHandoff: true, // handoff §7 — ángulo original del near-miss
  },
  {
    n: 4, slug: 'post-4-bug-nueve-revisiones',
    tasks: [24, 25],
    devlogMatches: ['task-24', 'task-25'],
    adrs: [],
    includeBacklog: false,
    includeHandoff: true, // handoff §7 — ángulo original del bug
  },
  {
    n: 5, slug: 'post-5-un-flag-tres-regresiones',
    tasks: [29, 30, 31],
    devlogMatches: ['task-29', 'task-30', 'task-31'],
    adrs: ['ADR-005'],
    includeBacklog: false,
    includeHandoff: true, // handoff §7 — ángulo original de la cascada de regresiones
  },
  {
    n: 6, slug: 'post-6-cierre-checker-necesita-revision',
    tasks: [35],
    devlogMatches: [],
    adrs: [],
    includeBacklog: true, // entrada [Resolved 2026-08-15] sobre icon.ico
    includeHandoff: true, // handoff §4 — última sección, el episodio de Task 35
  },
];

// ----------------------------------------------------------------- utils --

function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 70);
}

// Tokeniza una fila de tabla markdown respetando code-spans con backticks
// (para no partir una celda que contenga un `|` literal dentro de código).
function splitTableRow(line) {
  const cells = [];
  let cur = '';
  let inCode = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '`') { inCode = !inCode; cur += ch; continue; }
    if (ch === '|' && !inCode) { cells.push(cur); cur = ''; continue; }
    cur += ch;
  }
  cells.push(cur);
  if (cells.length && cells[0].trim() === '') cells.shift();
  if (cells.length && cells[cells.length - 1].trim() === '') cells.pop();
  return cells.map(c => c.trim());
}

// El proyecto usó 3 convenciones distintas a lo largo del tiempo para
// identificar la tarea de cada fila: "Step N" (las primeras 3 filas,
// fundacionales), "(Task N)"/"(Tasks N-M)" como sufijo (el grueso de las
// filas), y "Task N: Título" como prefijo (desde ~Task 24 en adelante).
function extractTaskNum(desc) {
  let m = desc.match(/^Task\s+(\d+)(?:\s*[-–]\s*(\d+))?\b/);
  if (m) return [parseInt(m[1], 10), m[2] ? parseInt(m[2], 10) : parseInt(m[1], 10)];

  const suffixMatches = [...desc.matchAll(/\(Tasks?\s+(\d+)(?:\s*[-–]\s*(\d+))?\)/g)];
  if (suffixMatches.length) {
    const last = suffixMatches[suffixMatches.length - 1];
    return [parseInt(last[1], 10), last[2] ? parseInt(last[2], 10) : parseInt(last[1], 10)];
  }

  m = desc.match(/\(Step\s+(\d+)/);
  if (m) { const t = parseInt(m[1], 10) + 1; return [t, t]; } // Step 0 -> Task 1, etc.

  return null;
}

// ------------------------------------------------------------- RUN_LOG.md --

function splitRunLog() {
  const raw = fs.readFileSync(PATHS.runLog, 'utf8').replace(/\r\n/g, '\n');
  const lines = raw.split('\n');
  const headerIdx = lines.findIndex(l => /^\|\s*Date\s*\|/i.test(l));
  if (headerIdx === -1) {
    throw new Error('No encontré la fila de encabezado ("| Date | ...") en RUN_LOG.md — revisar formato a mano.');
  }
  const headers = splitTableRow(lines[headerIdx]);
  let descCol = headers.findIndex(h => /^task$/i.test(h) || /description/i.test(h));
  if (descCol === -1) descCol = 1; // fallback: segunda columna suele ser la del feature/bug
  console.log(`RUN_LOG.md: usando columna "${headers[descCol]}" para detectar el número de tarea.`);

  const outDir = path.join(PATHS.outRaw, 'run-log');
  fs.mkdirSync(outDir, { recursive: true });

  const index = []; // { task, file }
  const unresolved = [];

  for (let i = headerIdx + 2; i < lines.length; i++) { // +2: salta la fila separadora ---
    const line = lines[i];
    if (!line.startsWith('|')) continue;
    const cells = splitTableRow(line);
    if (cells.length < headers.length - 1) continue; // fila corrupta/incompleta

    const row = {};
    headers.forEach((h, idx) => { row[h] = cells[idx] || ''; });

    const desc = row[headers[descCol]] || '';
    const range = extractTaskNum(desc);
    if (!range) {
      unresolved.push({ line: i + 1, desc: desc.slice(0, 140) });
      continue;
    }
    const [t0, t1] = range;
    let fname = t1 > t0
      ? `task-${String(t0).padStart(2, '0')}-${String(t1).padStart(2, '0')}.md`
      : `task-${String(t0).padStart(2, '0')}.md`;
    if (fs.existsSync(path.join(outDir, fname))) {
      // fila adicional para una tarea ya archivada (ej. una ronda de "follow-up")
      let n = 2;
      while (fs.existsSync(path.join(outDir, fname.replace(/\.md$/, `-cont${n}.md`)))) n++;
      fname = fname.replace(/\.md$/, `-cont${n}.md`);
    }

    const body = [
      `# RUN_LOG — ${t1 > t0 ? `Tasks ${t0}-${t1}` : `Task ${t0}`}`,
      '',
      ...headers.map(h => `**${h}**\n\n${row[h] || '(vacío)'}`),
    ].join('\n\n');

    fs.writeFileSync(path.join(outDir, fname), body + '\n');
    for (let t = t0; t <= t1; t++) index.push({ task: t, file: fname });
  }

  if (unresolved.length) {
    console.warn(`⚠️  RUN_LOG.md: ${unresolved.length} fila(s) sin número de tarea detectable al final de "Description" — no se archivaron, revisar a mano:`);
    unresolved.forEach(u => console.warn(`   línea ${u.line}: ...${u.desc}`));
  }
  console.log(`RUN_LOG.md → ${index.length} tarea(s) archivada(s) en ${outDir}`);
  return index;
}

// -------------------------------------------------------------- DEVLOG.md --

function splitDevLog() {
  const raw = fs.readFileSync(PATHS.devLog, 'utf8').replace(/\r\n/g, '\n');
  const outDir = path.join(PATHS.outRaw, 'devlog');
  fs.mkdirSync(outDir, { recursive: true });

  const parts = raw.split(/\n(?=## )/).filter(p => p.trim().startsWith('## '));
  const index = []; // { task, file, title, date }

  parts.forEach(part => {
    const heading = part.split('\n')[0];
    const m = heading.match(/^##\s+(\d{4}-\d{2}-\d{2})\s+(?:—|--)\s*(.*)$/);
    if (!m) { console.warn(`⚠️  DEVLOG.md: encabezado no reconocido, se omite: "${heading}"`); return; }
    const [, date, title] = m;
    const taskMatch = title.match(/Task (\d+)/);
    const task = taskMatch ? parseInt(taskMatch[1], 10) : null;
    const fname = `${date}--${slugify(title)}.md`;
    fs.writeFileSync(path.join(outDir, fname), part.trim() + '\n');
    index.push({ task, file: fname, title, date });
  });

  console.log(`DEVLOG.md → ${index.length} entrada(s) archivada(s) en ${outDir}`);
  return index;
}

// --------------------------------------------------------- bundles por post --

function buildPostBundles(runLogIndex, devLogIndex) {
  fs.mkdirSync(PATHS.outPosts, { recursive: true });

  POST_MAP.forEach(post => {
    const dir = path.join(PATHS.outPosts, post.slug);
    fs.mkdirSync(dir, { recursive: true });
    const manifest = [`# Bundle — Post ${post.n} (${post.slug})`, ''];

    post.tasks.forEach(t => {
      const hit = runLogIndex.find(r => r.task === t);
      if (hit) {
        const dest = `run-log_${hit.file}`;
        fs.copyFileSync(path.join(PATHS.outRaw, 'run-log', hit.file), path.join(dir, dest));
        manifest.push(`- [x] RUN_LOG: ${dest}`);
      } else {
        manifest.push(`- [ ] ⚠️ RUN_LOG: no se encontró fila para Task ${t} — revisar a mano`);
      }
      const reviewSrc = path.join(PATHS.reviewDir, `review_report_task${t}.md`);
      if (fs.existsSync(reviewSrc)) {
        fs.copyFileSync(reviewSrc, path.join(dir, `review_report_task${t}.md`));
        manifest.push(`- [x] review_report_task${t}.md`);
      } else {
        manifest.push(`- [ ] ⚠️ review_report_task${t}.md no existe en el bundle original`);
      }
    });

    post.devlogMatches.forEach(frag => {
      const hits = devLogIndex.filter(d => d.file.includes(frag));
      if (!hits.length) { manifest.push(`- [ ] ⚠️ DEVLOG: sin coincidencias para "${frag}" — revisar a mano`); return; }
      hits.forEach(hit => {
        const dest = `devlog_${hit.file}`;
        fs.copyFileSync(path.join(PATHS.outRaw, 'devlog', hit.file), path.join(dir, dest));
        manifest.push(`- [x] DEVLOG: ${dest}`);
      });
    });

    post.adrs.forEach(code => {
      if (!fs.existsSync(PATHS.adrDir)) return;
      const files = fs.readdirSync(PATHS.adrDir).filter(f => f.startsWith(code));
      if (!files.length) { manifest.push(`- [ ] ⚠️ ADR ${code}: no encontrada`); return; }
      files.forEach(f => {
        fs.copyFileSync(path.join(PATHS.adrDir, f), path.join(dir, f));
        manifest.push(`- [x] ${f}`);
      });
    });

    if (post.includeBacklog && fs.existsSync(PATHS.backlog)) {
      fs.copyFileSync(PATHS.backlog, path.join(dir, 'backlog.md'));
      manifest.push('- [x] backlog.md (completo)');
    }

    if (post.includeHandoff) {
      if (PATHS.handoff && fs.existsSync(PATHS.handoff)) {
        const destName = path.basename(PATHS.handoff);
        fs.copyFileSync(PATHS.handoff, path.join(dir, destName));
        manifest.push(`- [x] ${destName}`);
      } else {
        manifest.push('- [ ] ⚠️ nota de handoff: no se pasó --handoff <ruta> o el archivo no existe — copiarla a mano');
      }
    }

    fs.writeFileSync(path.join(dir, '_manifest.md'), manifest.join('\n') + '\n');
  });

  console.log(`Bundles por post armados en ${PATHS.outPosts}`);
}

// ------------------------------------------------------------------- main --

const runLogIndex = splitRunLog();
const devLogIndex = splitDevLog();
buildPostBundles(runLogIndex, devLogIndex);
console.log('\nListo:');
console.log(`  ${PATHS.outRaw}/   → atomizado completo (por si el mapeo de posts cambia)`);
console.log(`  ${PATHS.outPosts}/ → un folder por post, listo para subir a cada conversación`);
