// Mede a fluidez da rolagem com a roda do mouse, do topo ao fim da página.
// node fluidez.mjs <url> [--movel]
// Relata, por trecho da página, a média e o pior intervalo entre quadros e quantos passaram de 25 ms.
import puppeteer from 'puppeteer-core'

const url = process.argv[2]
const movel = process.argv.includes('--movel')
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
})
const page = await browser.newPage()
await page.setViewport({ width: movel ? 390 : 1920, height: movel ? 844 : 1080, isMobile: movel, hasTouch: movel })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 4000))

const largura = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, tela: innerWidth }))
await page.evaluate(() => {
  window.__q = []
  let ultimo = performance.now()
  const passo = (t) => {
    window.__q.push([t - ultimo, scrollY])
    ultimo = t
    requestAnimationFrame(passo)
  }
  requestAnimationFrame(passo)
})
await page.mouse.move(700, 500)
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
for (let i = 0; i < 400; i++) {
  await page.mouse.wheel({ deltaY: 120 })
  await new Promise((r) => setTimeout(r, 45))
  if (i % 20 === 0 && (await page.evaluate(() => scrollY)) >= total - 4) break
}
await new Promise((r) => setTimeout(r, 1200))
const { q, secoes } = await page.evaluate(() => ({
  q: window.__q,
  secoes: [...document.querySelectorAll('main > section, main > div, footer')].map((s) => ({ nome: s.id || s.className.split(' ')[0], topo: s.offsetTop, fim: s.offsetTop + s.offsetHeight })),
}))
const linhas = secoes.map((s) => {
  const qs = q.filter(([, y]) => y + 540 >= s.topo && y + 540 < s.fim).map(([d]) => d).slice(1)
  if (!qs.length) return `${s.nome.padEnd(14)} sem quadros`
  const media = qs.reduce((a, b) => a + b, 0) / qs.length
  const pior = Math.max(...qs)
  const lentos = qs.filter((d) => d > 25).length
  return `${s.nome.padEnd(14)} média ${media.toFixed(1)} ms  pior ${pior.toFixed(0)} ms  >25ms: ${lentos}/${qs.length}`
})
console.log(`largura: documento ${largura.doc}px, tela ${largura.tela}px ${largura.doc > largura.tela ? '(ROLAGEM LATERAL!)' : 'ok'}`)
console.log(linhas.join('\n'))
await browser.close()
