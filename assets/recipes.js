/**
 * Catacrypt — Recipe engine
 * Handles storage, markdown parsing, and ingredient scaling.
 */

const STORAGE_KEY = 'catacrypt_recipes';

// ── Metric units glued to number (e.g. 200g), others get a space ──────────
const METRIC_UNITS = new Set(['g', 'kg', 'ml', 'l', 'dl', 'cl']);

const ALL_UNITS = new Set([
  'g', 'kg', 'ml', 'l', 'dl', 'cl',
  'tsp', 'tbsp', 'tbsps',
  'cup', 'cups',
  'oz', 'lb', 'lbs',
  'pcs', 'pc', 'piece', 'pieces',
  'slice', 'slices',
  'can', 'cans',
  'handful', 'handfuls',
  'pinch', 'pinches',
  'bunch', 'bunches',
  'clove', 'cloves',
  'sprig', 'sprigs',
  'sheet', 'sheets',
  'drop', 'drops',
]);

// ── Storage helpers ────────────────────────────────────────────────────────
function loadRecipes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function getRecipeById(id) {
  return loadRecipes().find(r => r.id === id) || null;
}

function deleteRecipe(id) {
  saveRecipes(loadRecipes().filter(r => r.id !== id));
}

function addRecipe(raw) {
  const parsed = parseRecipe(raw);
  const name = parsed.meta.name || 'Untitled Recipe';
  const recipe = {
    id: crypto.randomUUID(),
    name,
    raw,
    addedAt: new Date().toISOString(),
  };
  const recipes = loadRecipes();
  recipes.unshift(recipe);
  saveRecipes(recipes);
  return recipe;
}

// ── Markdown parser ────────────────────────────────────────────────────────
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx < 0) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key) meta[key] = val;
  });
  return { meta, body: text.slice(match[0].length).trim() };
}

function parseSections(body) {
  const sections = {};
  const parts = body.split(/^##\s+/m);
  parts.forEach(part => {
    const nl = part.indexOf('\n');
    if (nl < 0) return;
    const title = part.slice(0, nl).trim().toLowerCase();
    sections[title] = part.slice(nl + 1).trim();
  });
  return sections;
}

function parseRecipe(raw) {
  const { meta, body } = parseFrontmatter(raw);
  const sections = parseSections(body);
  return { meta, sections };
}

// ── Ingredient scaling ─────────────────────────────────────────────────────
function parseIngredientLine(line) {
  const text = line.replace(/^[-*]\s*/, '').trim();
  if (!text) return null;

  // Match a number (integer, decimal, or simple fraction) at the start
  const numMatch = text.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)\s*(.*)/);
  if (!numMatch) return { scalable: false, display: text };

  const numStr = numMatch[1];
  let qty;
  if (numStr.includes('/')) {
    const [a, b] = numStr.split('/');
    qty = parseFloat(a) / parseFloat(b);
  } else {
    qty = parseFloat(numStr.replace(',', '.'));
  }

  const rest = numMatch[2].trim();
  const restParts = rest.split(/\s+/);

  if (restParts.length > 1 && ALL_UNITS.has(restParts[0].toLowerCase())) {
    return { scalable: true, qty, unit: restParts[0], ingredient: restParts.slice(1).join(' ') };
  }

  return { scalable: true, qty, unit: '', ingredient: rest };
}

function formatQty(n) {
  if (n <= 0) return '0';
  const whole = Math.floor(n);
  const frac  = n - whole;
  const FRACS = [[0.25,'¼'],[0.333,'⅓'],[0.5,'½'],[0.667,'⅔'],[0.75,'¾']];
  for (const [val, sym] of FRACS) {
    if (Math.abs(frac - val) < 0.04) return whole > 0 ? `${whole}${sym}` : sym;
  }
  if (Math.abs(n - Math.round(n)) < 0.05) return String(Math.round(n));
  return (Math.round(n * 10) / 10).toString();
}

function renderIngredients(sectionText, factor) {
  return sectionText.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed.match(/^[-*]/)) return `<p class="ing-note">${trimmed}</p>`;

    const parsed = parseIngredientLine(trimmed);
    if (!parsed) return '';
    if (!parsed.scalable) return `<li class="ing-item"><span class="ing-raw">${parsed.display}</span></li>`;

    const scaled    = parsed.qty * factor;
    const qtyStr    = formatQty(scaled);
    const separator = METRIC_UNITS.has(parsed.unit.toLowerCase()) ? '' : ' ';
    const qtyDisplay = parsed.unit
      ? `${qtyStr}${separator}${parsed.unit}`
      : qtyStr;

    return `<li class="ing-item"><span class="ing-qty">${qtyDisplay}</span><span class="ing-name">${parsed.ingredient}</span></li>`;
  }).join('');
}

function renderSteps(sectionText) {
  const lines = sectionText.split('\n').filter(l => l.trim());
  return lines.map(line => {
    const step = line.replace(/^\d+\.\s*/, '').trim();
    return `<li class="step-item">${step}</li>`;
  }).join('');
}
