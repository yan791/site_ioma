// Capturas com o Chrome headless (o painel do app pausa animações quando está escondido).
// node shot.mjs <url> <pasta-saida> [--largura=1440] [--altura=900] [--movel] [--paradas=<lista>]
// paradas: "nome:seletor:espera_ms" separadas por vírgula. seletor "topo" = início da página.
//   ex.: --paradas=hero:topo:2500,implante:#implante:1600,implante-fim:#implante:4500
// Cada parada rola até o seletor (descontando o cabeçalho), espera e captura a tela.
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const args = process.argv.slice(2)
const pos = args.filter((a) => !a.startsWith('--'))
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.length ? v.join('=') : true] }))
const [url, pasta] = pos
const largura = +(opt.largura || 1440)
const altura = +(opt.altura || 900)
mkdirSync(pasta, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
})
const page = await browser.newPage()
const erros = []
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) erros.push(`[${m.type()}] ${m.text()}`) })
page.on('pageerror', (e) => erros.push(`[pageerror] ${e.message}`))
page.on('requestfailed', (r) => erros.push(`[falha] ${r.url()} ${r.failure()?.errorText}`))
await page.setViewport({ width: largura, height: altura, deviceScaleFactor: 1, isMobile: !!opt.movel, hasTouch: !!opt.movel })
const t0 = Date.now()
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)

const paradas = (opt.paradas || 'hero:topo:2500').split(',').map((p) => { const [nome, sel, espera] = p.split(':'); return { nome, sel, espera: +(espera || 1500) } })
for (const p of paradas) {
  if (p.sel !== 'agora') {
    // "#secao+700" rola até a seção e mais 700 px
    await page.evaluate((alvo) => {
      const [sel, mais] = alvo.split('+')
      const y = sel === 'topo' ? 0 : /^\d+$/.test(sel) ? +sel : document.querySelector(sel).getBoundingClientRect().top + scrollY - 70
      window.scrollTo(0, y + (mais ? +mais : 0))
    }, p.sel)
  }
  await new Promise((r) => setTimeout(r, p.espera))
  await page.screenshot({ path: `${pasta}/${p.nome}.png` })
  console.log(`${p.nome} (${((Date.now() - t0) / 1000).toFixed(1)}s)`)
}
if (opt.estado) console.log(await page.evaluate(opt.estado))
console.log(erros.length ? erros.join('\n') : 'sem erros no console')
await browser.close()
