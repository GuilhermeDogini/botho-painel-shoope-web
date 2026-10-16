/**
 * Capturas da interface a 390 px e 1440 px, em claro e escuro, para conferir antes de dizer que está pronto.
 *
 *   npm run capture                          → /vitrine inteira
 *   npm run capture -- --section botoes      → só a seção #vt-botoes da Vitrine
 *   npm run capture -- --path /produtos --name produtos
 *
 * Precisa do `npm run dev` rodando (porta 5182). Usa o Edge do Windows (channel msedge), sem baixar navegador.
 * Falha (código 1) se a página rolar de lado ou se aparecer erro no console.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium, type Browser } from 'playwright';

const WIDTHS = [390, 1440] as const;
const THEMES = ['light', 'dark'] as const;
const OUT_DIR = path.resolve(import.meta.dirname, '..', '.captures');

const { values } = parseArgs({
  options: {
    path: { type: 'string', default: '/vitrine' },
    section: { type: 'string' },
    name: { type: 'string' },
    base: { type: 'string', default: process.env.CAPTURE_BASE ?? 'http://localhost:5182' },
  },
});

const route = values.path.startsWith('/') ? values.path : `/${values.path}`;
const name = values.name ?? (values.section ? `vitrine-${values.section}` : route.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'inicio');

async function shoot(browser: Browser, width: number, theme: (typeof THEMES)[number]): Promise<string[]> {
  const problems: string[] = [];
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, colorScheme: theme });
  await context.addInitScript((t) => localStorage.setItem('botho:tema', t), theme);
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`erro no console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`erro na página: ${err.message}`));

  try {
    await page.goto(values.base + route, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      // Fotos com loading="lazy" só carregam ao rolar; aqui tudo carrega (ou falha) antes da foto.
      const pending = [...document.images].filter((img) => {
        img.loading = 'eager';
        return !img.complete;
      });
      const settled = pending.map(
        (img) =>
          new Promise<void>((done) => {
            img.addEventListener('load', () => done(), { once: true });
            img.addEventListener('error', () => done(), { once: true });
          }),
      );
      await Promise.race([Promise.all(settled), new Promise((done) => setTimeout(done, 5000))]);
    });
    await page.waitForTimeout(150);

    const overflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth <= vw) return null;
      const wide = [...document.querySelectorAll<HTMLElement>('body *')]
        .filter((el) => el.getBoundingClientRect().right > vw + 1)
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}.${[...el.classList].slice(0, 3).join('.')}`);
      return { scroll: document.documentElement.scrollWidth, vw, wide };
    });
    if (overflow) problems.push(`rola de lado: ${overflow.scroll}px numa tela de ${overflow.vw}px (${overflow.wide.join(', ')})`);

    const file = path.join(OUT_DIR, `${name}-${width}-${theme === 'light' ? 'claro' : 'escuro'}.png`);
    if (values.section) {
      const target = page.locator(`#vt-${values.section}`);
      if ((await target.count()) === 0) throw new Error(`seção #vt-${values.section} não existe em ${route}`);
      await target.screenshot({ path: file, animations: 'disabled' });
    } else {
      await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
    }
    console.log(`ok  ${path.relative(process.cwd(), file)}`);
  } finally {
    await context.close();
  }
  return problems.map((p) => `[${width} ${theme}] ${p}`);
}

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge' });
  const problems: string[] = [];
  try {
    for (const width of WIDTHS) for (const theme of THEMES) problems.push(...(await shoot(browser, width, theme)));
  } finally {
    await browser.close();
  }
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exitCode = 1;
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
