// Testa as interações principais no build: abrir/montar o dente, girar arrastando,
// trocar caso e arrastar o comparador, e montar a mensagem do WhatsApp.
// node interacoes.mjs <url> <pasta-saida>
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const [url, pasta = 'shots/interacoes'] = process.argv.slice(2)
mkdirSync(pasta, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
})
const page = await browser.newPage()
const erros = []
page.on('pageerror', (e) => erros.push(e.message))
page.on('console', (m) => m.type() === 'error' && erros.push(m.text()))
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0' })
await page.evaluate(() => (window.open = (u) => (window.__aberto = u)))
const espera = (ms) => new Promise((r) => setTimeout(r, ms))
const rolar = (sel) => page.evaluate((s) => window.scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY - 70), sel)
const ok = (cond, txt) => console.log(`${cond ? 'OK ' : 'FALHOU'} ${txt}`)

// 1. dente: monta sozinho, abre no botão, gira arrastando
await espera(3000)
await rolar('#implante')
await espera(4600)
const montado = await page.evaluate(() => document.querySelector('.palco canvas').style.opacity)
ok(montado === '1', `dente aparece e se monta sozinho (opacidade ${montado})`)
await page.click('.botao-palco')
await espera(1400)
const rotulo = await page.$eval('.botao-palco', (b) => b.textContent.trim())
const pecas = await page.$$eval('.peca', (ps) => ps.map((p) => +getComputedStyle(p).opacity))
ok(rotulo.includes('Montar') && pecas.every((o) => o > 0.9), `"Ver por dentro" abre as peças (${pecas.map((o) => o.toFixed(2)).join(', ')})`)
await page.screenshot({ path: `${pasta}/dente-aberto.png` })
const caixa = await page.$eval('.palco', (p) => { const r = p.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } })
await page.mouse.move(caixa.x, caixa.y)
await page.mouse.down()
for (let i = 0; i < 12; i++) { await page.mouse.move(caixa.x + i * 18, caixa.y); await espera(16) }
await page.mouse.up()
await espera(600)
await page.screenshot({ path: `${pasta}/dente-girado.png` })
await page.click('.botao-palco')
await espera(1500)
const fechado = await page.$eval('.botao-palco', (b) => b.textContent.trim())
ok(fechado.includes('Ver por dentro'), 'o botão volta a montar o dente')

// 2. casos: troca de aba e arrasto do comparador
await rolar('#casos')
await espera(2200)
await page.click('.aba:nth-child(3)')
await espera(1800)
const ativo = await page.evaluate(() => [...document.querySelectorAll('.comparador__par')].findIndex((p) => p.classList.contains('ativo')))
ok(ativo === 2, `aba 3 mostra o caso 3 (ativo: ${ativo + 1})`)
const comp = await page.$eval('.comparador', (c) => { const r = c.getBoundingClientRect(); return { x: r.left, y: r.top + r.height / 2, w: r.width } })
await page.mouse.move(comp.x + comp.w * 0.5, comp.y)
await page.mouse.down()
await page.mouse.move(comp.x + comp.w * 0.2, comp.y, { steps: 8 })
await page.mouse.up()
const pos = await page.$eval('.comparador', (c) => c.getAttribute('aria-valuenow'))
ok(Math.abs(+pos - 20) < 4, `arrastar o comparador leva a linha a 20% (${pos}%)`)
await page.screenshot({ path: `${pasta}/caso-coroa.png` })

// 3. agendar: monta a mensagem do WhatsApp
await rolar('#contato')
await espera(1500)
await page.click('.chip:nth-of-type(2)')
await page.type('.formulario__campo input', 'Ana')
await page.click('.formulario button[type=submit]')
await espera(300)
const link = await page.evaluate(() => window.__aberto)
const texto = decodeURIComponent(link?.split('text=')[1] || '')
ok(link?.startsWith('https://wa.me/5581988062409') && texto.includes('Ana') && texto.includes('prótese protocolo'), `WhatsApp: "${texto}"`)

// 4. menu e links internos
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
await page.evaluate(() => window.scrollTo(0, 0))
await espera(800)
await page.click('.cabecalho__abrir')
await espera(700)
await page.screenshot({ path: `${pasta}/menu-movel.png` })
await page.click('.menu-movel nav a[href="#equipe"]')
await espera(1800)
const topoEquipe = await page.$eval('#equipe', (e) => Math.round(e.getBoundingClientRect().top))
ok(Math.abs(topoEquipe) < 120, `menu leva à equipe (topo da seção a ${topoEquipe}px)`)

console.log(erros.length ? `erros: ${erros.join(' | ')}` : 'sem erros no console')
await browser.close()
