import { useEffect, useRef, useState } from 'react'
import { contato, implante, pecas } from '../dados/conteudo'
import { Anel, Simbolo } from '../componentes/Marca'
import { IconeWhats, Palavras, Sobretitulo } from '../componentes/base'
import { gsap } from '../lib/rolagem'

/*
 * O dente 3D (o mesmo modelo do site do Dr. Matheus Jansen): quando a seção aparece,
 * implante, pilar e coroa descem abertos, mostram o nome e se encaixam em uns três
 * segundos, sem depender de rolar. Depois o visitante gira arrastando e abre as peças.
 */

const VH1 = 2 * Math.tan((15 * Math.PI) / 180) // altura visível por unidade de distância (fov 30)
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const suave = (a, b, x) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// espera a página ficar parada (ninguém rolando há 350 ms) e o navegador ocioso
let ultimaRolagem = 0
if (typeof window !== 'undefined') window.addEventListener('scroll', () => (ultimaRolagem = performance.now()), { passive: true })
function calmo(espera = 350) {
  return new Promise((resolver) => {
    const tentar = () => {
      const falta = espera - (performance.now() - ultimaRolagem)
      if (falta > 0) return void setTimeout(tentar, falta + 20)
      const ric = window.requestIdleCallback || ((f) => setTimeout(f, 16))
      ric(() => (performance.now() - ultimaRolagem < espera ? tentar() : resolver()), { timeout: 800 })
    }
    tentar()
  })
}

// grava estilo só quando muda (evita trabalho de layout a cada quadro)
const cache = new WeakMap()
function css(el, prop, val) {
  if (!el) return
  let c = cache.get(el)
  if (!c) cache.set(el, (c = {}))
  if (c[prop] === val) return
  c[prop] = val
  if (prop.startsWith('--')) el.style.setProperty(prop, val)
  else el.style[prop] = val
}
const f3 = (n) => (Math.round(n * 1000) / 1000).toString()
const px = (n) => `${Math.round(n * 10) / 10}px`

function Palco({ aberto, setAberto }) {
  const palcoRef = useRef(null)
  const canvasRef = useRef(null)
  const abertoRef = useRef(aberto)
  const ctl = useRef({})

  useEffect(() => {
    abertoRef.current = aberto
    ctl.current.alternar?.(aberto)
  }, [aberto])

  useEffect(() => {
    const palco = palcoRef.current
    const canvas = canvasRef.current
    const secao = palco.closest('.implante')
    const rotulos = Array.from(palco.querySelectorAll('.peca'))
    const linhas = Array.from(palco.querySelectorAll('.pecas-linhas path'))
    const pontos = Array.from(palco.querySelectorAll('.pecas-linhas circle'))

    let cena = null
    let fim = false
    const st = { entrada: 0, partsIn: 0, explode: 1, spin: 0, giro: -0.9 }
    let intro = null

    // ---------- medidas ----------
    let w = 1, h = 1, movel = false
    const tamRotulo = []
    function medir() {
      w = palco.clientWidth
      h = palco.clientHeight
      movel = w < 560
      cena?.resize(w, h, window.devicePixelRatio || 1)
      rotulos.forEach((r, i) => (tamRotulo[i] = { w: r.offsetWidth, h: r.offsetHeight }))
    }

    // ---------- arrastar para girar ----------
    let arrasto = 0, vel = 0, arrastando = false, ultimoX = 0
    const aoPressionar = (e) => {
      if (e.target.closest('button')) return
      arrastando = true
      ultimoX = e.clientX
      palco.classList.add('arrastando')
    }
    const aoMover = (e) => {
      if (!arrastando) return
      const dx = e.clientX - ultimoX
      ultimoX = e.clientX
      vel = dx * 0.011
      arrasto += vel
    }
    const aoSoltar = () => {
      arrastando = false
      palco.classList.remove('arrastando')
    }
    palco.addEventListener('pointerdown', aoPressionar)
    window.addEventListener('pointermove', aoMover, { passive: true })
    window.addEventListener('pointerup', aoSoltar)
    window.addEventListener('pointercancel', aoSoltar)

    // ---------- abrir e montar ----------
    ctl.current.alternar = (abrir) => {
      if (!cena) return
      if (intro) {
        // o visitante tocou durante a montagem: termina a entrada e segue o pedido dele
        intro.kill()
        intro = null
        gsap.to(st, { entrada: 1, partsIn: 1, giro: 0.25, duration: 0.6, ease: 'power2.out' })
      }
      gsap.to(st, {
        explode: abrir ? 1 : 0,
        spin: st.spin + (abrir ? Math.PI * 2 : -Math.PI * 4),
        duration: abrir ? 1 : 1.2,
        ease: 'power3.inOut',
        overwrite: 'auto',
      })
    }

    function entrar() {
      // montagem automática: as peças descem abertas, mostram o nome e se encaixam
      intro = gsap
        .timeline({ delay: 0.05 })
        .to(st, { entrada: 1, duration: 0.7, ease: 'power2.out' }, 0)
        .to(st, { partsIn: 1, duration: 1.15, ease: 'power3.out' }, 0.1)
        .to(st, { spin: Math.PI * 2, duration: 1.15, ease: 'power2.out' }, 0.1)
        .to(st, { giro: -0.35, duration: 1.4, ease: 'power2.out' }, 0)
        .to(st, { explode: 0, duration: 1.2, ease: 'power3.inOut' }, 2.25)
        .to(st, { spin: -Math.PI * 2, duration: 1.2, ease: 'power3.inOut' }, 2.25)
        .to(st, { giro: 0.25, duration: 1.4, ease: 'power2.inOut' }, 2.2)
        .call(() => {
          intro = null
          // se o visitante abriu as peças durante a montagem, respeita
          if (abertoRef.current) ctl.current.alternar(true)
        })
    }

    // a montagem começa quando o palco aparece na tela (e o motor 3D já carregou)
    let naTela = false
    let pronto = false
    let entrou = false
    const tentarEntrar = () => {
      if (entrou || !pronto || !naTela) return
      entrou = true
      entrar()
    }
    const ioEntrada = new IntersectionObserver(
      ([e]) => {
        naTela = e.isIntersecting
        tentarEntrar()
      },
      { threshold: 0.35 },
    )
    ioEntrada.observe(palco)

    // o motor 3D carrega depois da abertura, num momento ocioso, para não disputar com o vídeo
    const carregar = () =>
      import('../three/cenaDente.js')
        .then(async ({ CenaDente }) => {
          if (fim) return
          try {
            cena = new CenaDente(canvas)
            medir()
            await cena.aquecer()
            if (fim) return
            // o primeiro desenho (material translúcido da coroa) custa uns 500 ms na GPU:
            // ele acontece agora, escondido e com a página parada, e não no meio da rolagem
            await calmo()
            if (fim) return
            const guardado = { ...st }
            Object.assign(st, { partsIn: 1, explode: 0.5 })
            aplicar(0, 0)
            cena.render()
            Object.assign(st, guardado)
            aplicar(0, 0)
            palco.classList.add('com-3d')
            pronto = true
            tentarEntrar()
          } catch {
            palco.classList.add('sem-webgl')
          }
        })
        .catch(() => palco.classList.add('sem-webgl'))
    const ric = window.requestIdleCallback || ((f) => setTimeout(f, 200))
    const idOcioso = ric(carregar, { timeout: 1500 })

    // ---------- quadro ----------
    let giroLivre = 0
    function aplicar(t, dt) {
      const k = dt / 16.67
      // inércia do arrasto
      if (!arrastando) {
        arrasto += vel
        vel *= Math.pow(0.92, k)
      }
      const ex = st.explode
      giroLivre += (dt / 1000) * lerp(0.26, 0.06, ex) * (intro ? 0 : 1)

      // rolagem: o dente gira um pouco enquanto a seção passa (-1 entrando, 0 no centro, 1 saindo)
      const r = secao.getBoundingClientRect()
      const p = clamp((window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight, -1, 1)

      // enquadramento: montado (altura 2,6) ou aberto (altura 3,95)
      const alt = lerp(2.62, 3.95, ex)
      const centro = lerp(0.71, 0.84, ex)
      const ocupa = movel ? 0.8 : 0.7
      const aspecto = w / h
      const dist = Math.max(alt / (ocupa * VH1), 1.05 / ((movel ? 0.5 : 0.4) * VH1 * aspecto))
      const ppu = h / (VH1 * dist)
      const desloc = movel ? -0.16 * ex : -0.3 * ex

      cena.apply(
        {
          rotY: st.giro + giroLivre + arrasto + p * 0.9,
          tiltX: 0.05,
          explode: ex,
          partsIn: st.partsIn,
          spin: st.spin,
          camDist: dist,
          camTargetY: centro,
          shiftX: desloc,
          shiftY: 0,
          scale: lerp(0.94, 1, st.entrada) * lerp(1, 0.9, Math.max(0, p)),
        },
        t / 1000,
      )
      css(canvas, 'opacity', f3(st.entrada))

      // marcações das peças: aparecem com o dente aberto
      const vis = suave(0.55, 0.95, ex) * st.partsIn
      const colunaX = w / 2 + desloc * ppu + 0.45 * ppu + (movel ? 18 : 46)
      let ultimoY = -999
      for (let i = 0; i < 3; i++) {
        const a = cena.ancora(i)
        const r = rotulos[i]
        const tam = tamRotulo[i] || { w: 160, h: 40 }
        const lx = Math.min(colunaX, w - tam.w - 8)
        let ly = a.y - 12
        ly = Math.max(ly, ultimoY + tam.h + 8)
        ultimoY = ly
        const atraso = clamp(vis * 1.6 - i * 0.3)
        css(r, 'opacity', f3(atraso))
        css(r, 'visibility', atraso < 0.01 ? 'hidden' : 'visible')
        css(r, 'transform', `translate3d(${px(lx)},${px(ly)},0)`)
        const ax = lx - 10
        const ay = ly + 11
        linhas[i].setAttribute('d', `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${(ax - 18).toFixed(1)} ${ay.toFixed(1)}L${ax.toFixed(1)} ${ay.toFixed(1)}`)
        css(linhas[i], 'strokeDashoffset', f3(1 - atraso))
        css(pontos[i], 'opacity', f3(atraso))
        css(pontos[i], 'transform', `translate(${px(a.x)},${px(a.y)})`)
      }
      css(palco, '--aberto', f3(ex))
    }

    let raf = 0, rodando = false, ultimo = 0
    function quadro(t) {
      raf = 0
      const dt = Math.min(64, t - (ultimo || t))
      ultimo = t
      if (cena) {
        aplicar(t, dt)
        cena.render()
      }
      if (rodando) raf = requestAnimationFrame(quadro)
    }
    const ligar = () => {
      if (rodando) return
      rodando = true
      ultimo = 0
      raf = requestAnimationFrame(quadro)
    }
    const desligar = () => {
      rodando = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? ligar() : desligar()), { rootMargin: '80px 0px' })
    io.observe(palco)
    const aoVisibilidade = () => (document.hidden ? desligar() : palco.getBoundingClientRect().bottom > 0 && ligar())
    document.addEventListener('visibilitychange', aoVisibilidade)
    const ro = new ResizeObserver(medir)
    ro.observe(palco)
    medir()
    ligar()

    if (import.meta.env.DEV) window.__palco = { st, get cena() { return cena } }

    return () => {
      fim = true
      desligar()
      ioEntrada.disconnect()
      ;(window.cancelIdleCallback || clearTimeout)(idOcioso)
      intro?.kill()
      gsap.killTweensOf(st)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', aoVisibilidade)
      palco.removeEventListener('pointerdown', aoPressionar)
      window.removeEventListener('pointermove', aoMover)
      window.removeEventListener('pointerup', aoSoltar)
      window.removeEventListener('pointercancel', aoSoltar)
      cena?.dispose()
    }
  }, [])

  return (
    <div className="palco" ref={palcoRef}>
      <div className="palco__brilho" aria-hidden="true" />
      <Simbolo modo="traco" className="palco__simbolo" espessura={0.35} />
      <Anel className="palco__anel" texto="INSTITUTO ODONTOLÓGICO · MELO ARAGÃO · TECNOLOGIA · PRECISÃO · CUIDADO ·" />
      <canvas ref={canvasRef} className="palco__canvas" aria-hidden="true" />
      <svg className="pecas-linhas" aria-hidden="true">
        {pecas.map((_, i) => (
          <path key={i} pathLength="1" />
        ))}
        {pecas.map((_, i) => (
          <circle key={i} r="3.2" />
        ))}
      </svg>
      {pecas.map((p) => (
        <div className="peca" key={p.titulo}>
          <span className="peca__titulo">{p.titulo}</span>
          <span className="peca__texto">{p.texto}</span>
        </div>
      ))}
      <div className="palco__controles">
        <button type="button" className="botao-palco" aria-pressed={aberto} onClick={() => setAberto(!aberto)}>
          <span className="botao-palco__icone" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {aberto ? 'Montar o dente' : 'Ver por dentro'}
        </button>
        <span className="palco__dica" aria-hidden="true">
          Arraste para girar
        </span>
      </div>
    </div>
  )
}

export default function Implante() {
  const [aberto, setAberto] = useState(false)
  return (
    <section className="implante secao secao--escura" id="implante" aria-labelledby="implante-titulo">
      <div className="conteudo implante__grade">
        <div className="implante__texto">
          <Sobretitulo claro>{implante.sobretitulo}</Sobretitulo>
          <h2 className="titulo-secao titulo-secao--claro" id="implante-titulo" data-revelar>
            <Palavras texto={implante.titulo[0]} />
            <br />
            <em>
              <Palavras texto={implante.titulo[1]} inicio={0.2} />
            </em>
          </h2>
          <p className="lede lede--claro" data-revelar style={{ '--d': '0.2s' }}>
            {implante.texto}
          </p>
          <ul className="implante__pecas" data-revelar style={{ '--d': '0.3s' }}>
            {pecas.map((p, i) => (
              <li key={p.titulo}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {p.titulo}
              </li>
            ))}
          </ul>
          <div data-revelar style={{ '--d': '0.38s' }}>
            <a className="botao botao--terracota" href={contato.linkWhatsapp('Olá! Vim pelo site do IOMA e gostaria de saber mais sobre implantes.')} target="_blank" rel="noopener">
              <IconeWhats className="botao__icone" />
              Quero saber sobre implantes
            </a>
          </div>
        </div>
        <Palco aberto={aberto} setAberto={setAberto} />
      </div>
    </section>
  )
}
