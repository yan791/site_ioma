import { useEffect } from 'react'
import Cabecalho from './componentes/Cabecalho'
import Hero from './secoes/Hero'
import Faixa from './secoes/Faixa'
import Implante from './secoes/Implante'
import Tratamentos from './secoes/Tratamentos'
import Casos from './secoes/Casos'
import Metodo from './secoes/Metodo'
import Espaco from './secoes/Espaco'
import Equipe from './secoes/Equipe'
import Depoimentos from './secoes/Depoimentos'
import Agendar from './secoes/Agendar'
import Rodape from './secoes/Rodape'
import { gsap, iniciarRolagem, encerrarRolagem, ligarAncoras, ligarRevelacoes, ScrollTrigger } from './lib/rolagem'

/* Deslocamentos suaves de imagem na rolagem (nunca prendem a página). */
function ligarParalaxe() {
  const ctx = gsap.context(() => {
    document.querySelectorAll('[data-paralaxe]').forEach((el) => {
      gsap.fromTo(el, { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    document.querySelectorAll('[data-paralaxe-leve]').forEach((el) => {
      gsap.fromTo(el, { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1.08, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
  })
  return () => ctx.revert()
}

export default function App() {
  useEffect(() => {
    iniciarRolagem()
    const soltarAncoras = ligarAncoras()
    const revelacoes = ligarRevelacoes()
    const soltarParalaxe = ligarParalaxe()
    // imagens que carregam depois mudam a altura da página
    const aoCarregar = () => ScrollTrigger.refresh()
    window.addEventListener('load', aoCarregar)
    // pausa as animações em loop quando a aba fica escondida
    const aoVisibilidade = () => document.body.classList.toggle('pausado', document.hidden)
    document.addEventListener('visibilitychange', aoVisibilidade)
    return () => {
      soltarAncoras()
      revelacoes.parar()
      soltarParalaxe()
      encerrarRolagem()
      window.removeEventListener('load', aoCarregar)
      document.removeEventListener('visibilitychange', aoVisibilidade)
    }
  }, [])

  return (
    <>
      <div className="ambiente" aria-hidden="true" />
      <Cabecalho />
      <main id="principal" tabIndex={-1}>
        <Hero />
        <Faixa />
        <Implante />
        <Tratamentos />
        <Casos />
        <Metodo />
        <Espaco />
        <Equipe />
        <Depoimentos />
        <Agendar />
      </main>
      <Rodape />
    </>
  )
}
