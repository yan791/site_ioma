// Gera a imagem de prévia de link (1200x630) a partir da abertura do site.
// node og.mjs <url> <saida.jpg>
import puppeteer from 'puppeteer-core'
const [url, saida] = process.argv.slice(2)
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630 })
await page.goto(url, { waitUntil: 'networkidle0' })
// quadro fixo do vídeo e sem cabeçalho, para a prévia ficar limpa
await page.evaluate(() => {
  const v = document.querySelector('.hero__video')
  v.pause()
  v.currentTime = 2.2
  document.querySelector('.cabecalho').style.display = 'none'
  document.querySelector('.hero__descer').style.display = 'none'
})
await new Promise((r) => setTimeout(r, 3200))
await page.screenshot({ path: saida, type: 'jpeg', quality: 86 })
await browser.close()
console.log('ok', saida)
