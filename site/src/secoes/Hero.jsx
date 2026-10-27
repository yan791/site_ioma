import { useEffect, useRef, useState } from 'react'
import { contato, hero, nota } from '../dados/conteudo'
import { Simbolo } from '../componentes/Marca'
import { Estrelas, IconeWhats } from '../componentes/base'

/*
 * Abertura: o vídeo do consultório real no fim de tarde (a câmera entra devagar na sala)
 * e o título por cima. Tudo entra em menos de dois segundos, sem depender de rolar.
 * Ao rolar, o vídeo afunda um pouco e escurece, e a página assume.
 */
export default function Hero() {
  const [pronto, setPronto] = useState(false)
  // celular recebe a versão leve do vídeo (540p, um terço do peso)
  const [fonte] = useState(() => (window.innerWidth < 760 ? 'video/consultorio-leve.mp4' : 'video/consultorio.mp4'))
  const raiz = useRef(null)
  const video = useRef(null)

  useEffect(() => {
    // espera as fontes (no máximo meio segundo) para o título não pular na entrada
    let vivo = true
    const t = setTimeout(() => vivo && setPronto(true), 500)
    document.fonts?.ready.then(() => vivo && setPronto(true))
    return () => {
      vivo = false
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const el = raiz.current
    const v = video.current
    // o vídeo só toca enquanto a abertura está na tela
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(el)
    let raf = 0
    const aoRolar = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const p = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight))
        el.style.setProperty('--saida', p.toFixed(3))
      })
    }
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', aoRolar)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={raiz} className={`hero ${pronto ? 'pronto' : ''}`} id="inicio" aria-labelledby="hero-titulo">
      <div className="hero__midia" aria-hidden="true">
        <video
          ref={video}
          className="hero__video"
          src={fonte}
          poster="video/consultorio-poster.jpg"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          tabIndex={-1}
        />
        <div className="hero__veu" />
      </div>
      <Simbolo modo="traco" className="hero__simbolo" espessura={0.25} />

      <div className="hero__conteudo conteudo">
        <p className="hero__sobretitulo entra" style={{ '--d': '0.05s' }}>
          {hero.sobretitulo}
        </p>
        <h1 className="hero__titulo" id="hero-titulo">
          {hero.titulo.map((linha, i) => (
            <span className="linha" key={linha}>
              <span style={{ '--d': `${0.12 + i * 0.09}s` }}>
                {linha}
                {i === hero.titulo.length - 1 ? ' ' : ''}
                {i === hero.titulo.length - 1 && <em>{hero.destaque}</em>}
              </span>
            </span>
          ))}
        </h1>
        <div className="hero__rodape">
          <p className="hero__lede entra" style={{ '--d': '0.5s' }}>
            {hero.texto}
          </p>
          <div className="hero__acoes entra" style={{ '--d': '0.62s' }}>
            <a className="botao botao--terracota" href={contato.linkWhatsapp()} target="_blank" rel="noopener">
              <IconeWhats className="botao__icone" />
              Agendar consulta
            </a>
            <a className="botao botao--vidro" href="#casos">
              Ver casos reais
            </a>
          </div>
          <a className="hero__nota entra" style={{ '--d': '0.74s' }} href={contato.avaliacoesGoogle} target="_blank" rel="noopener">
            <Estrelas />
            <span>
              <strong>{nota.valor}</strong> no Google · {nota.total} avaliações
            </span>
          </a>
        </div>
      </div>

      <p className="hero__local entra" style={{ '--d': '0.9s' }} aria-hidden="true">
        RioMar Trade Center · Recife
      </p>
      <a className="hero__descer" href="#implante" aria-label="Ir para a próxima seção">
        <span />
      </a>
    </section>
  )
}
