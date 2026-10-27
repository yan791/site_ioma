/*
 * Rolagem suave (Lenis) ligada ao GSAP ScrollTrigger.
 * Nada aqui prende o visitante: a página rola livre, as animações acompanham.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
const pulso = (t) => lenis?.raf(t * 1000)

export function iniciarRolagem() {
  if (lenis) return lenis
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, smoothWheel: true, touchMultiplier: 1.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(pulso)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function encerrarRolagem() {
  gsap.ticker.remove(pulso)
  lenis?.destroy()
  lenis = null
}

export function rolarPara(alvo) {
  if (lenis) {
    // o Lenis respeita o scroll-padding-top do html (altura do cabeçalho)
    lenis.scrollTo(alvo, { duration: 1.2, force: true })
    return
  }
  const el = typeof alvo === 'string' ? document.querySelector(alvo) : alvo
  el?.scrollIntoView({ behavior: 'smooth' })
}

export function travarRolagem(travar) {
  document.documentElement.classList.toggle('travado', travar)
  if (travar) lenis?.stop()
  else lenis?.start()
}

/** Links internos (#secao) passam pela rolagem suave e levam o foco para a seção. */
export function ligarAncoras() {
  const aoClicar = (e) => {
    const a = e.target.closest?.('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')
    if (id.length < 2) return
    const alvo = document.querySelector(id)
    if (!alvo) return
    e.preventDefault()
    const ir = () => {
      rolarPara(id === '#inicio' ? 0 : alvo)
      history.replaceState(null, '', id)
      alvo.setAttribute('tabindex', '-1')
      alvo.focus({ preventScroll: true })
    }
    // vindo do menu do celular: espera o menu fechar e destravar a rolagem,
    // senão o Lenis zera o deslize ao voltar a rodar
    if (document.documentElement.classList.contains('travado')) setTimeout(ir, 80)
    else ir()
  }
  document.addEventListener('click', aoClicar)
  return () => document.removeEventListener('click', aoClicar)
}

/**
 * Revelação por entrada na tela: todo elemento com [data-revelar] ganha a classe
 * "visivel" uma vez, quando entra. O CSS faz o resto (transform e opacity).
 */
export function ligarRevelacoes(raiz = document) {
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue
        e.target.classList.add('visivel')
        io.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
  )
  const observar = () => raiz.querySelectorAll('[data-revelar]:not(.visivel)').forEach((el) => io.observe(el))
  observar()
  return { observar, parar: () => io.disconnect() }
}

export { gsap, ScrollTrigger }
