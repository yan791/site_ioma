import { useEffect, useRef, useState } from 'react'
import { contato, depoimentos, nota } from '../dados/conteudo'
import { Estrelas, Foto, Palavras, Seta, Sobretitulo } from '../componentes/base'

/* Avaliações reais do Google, com a nota contando até 5,0 quando a seção entra. */
function Nota() {
  const ref = useRef(null)
  const [valor, setValor] = useState(0)
  useEffect(() => {
    const el = ref.current
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const passo = (t) => {
          const k = Math.min(1, (t - t0) / 1300)
          setValor(5 * (1 - Math.pow(1 - k, 3)))
          if (k < 1) raf = requestAnimationFrame(passo)
        }
        raf = requestAnimationFrame(passo)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <a className="nota" ref={ref} href={contato.avaliacoesGoogle} target="_blank" rel="noopener" data-revelar>
      <span className="nota__valor" aria-label={`Nota ${nota.valor}`}>
        {valor.toFixed(1).replace('.', ',')}
      </span>
      <span className="nota__lado">
        <Estrelas />
        <span>
          {nota.total} avaliações no Google <Seta className="seta" />
        </span>
      </span>
    </a>
  )
}

export default function Depoimentos() {
  const d = depoimentos.destaque
  return (
    <section className="depoimentos secao secao--escura" id="depoimentos" aria-labelledby="depoimentos-titulo">
      <div className="conteudo">
        <div className="depoimentos__topo">
          <div>
            <Sobretitulo claro>{depoimentos.sobretitulo}</Sobretitulo>
            <h2 className="titulo-secao titulo-secao--claro" id="depoimentos-titulo" data-revelar>
              <Palavras texto={depoimentos.titulo} />
            </h2>
          </div>
          <Nota />
        </div>

        <figure className="destaque">
          <div className="arco arco--destaque" data-revelar>
            <Foto nome={d.foto} alt="Dona Vaneide, paciente do IOMA" sizes="(min-width: 960px) 30vw, 70vw" />
          </div>
          <blockquote className="destaque__citacao" data-revelar style={{ '--d': '0.1s' }}>
            <span className="destaque__aspas" aria-hidden="true">
              “
            </span>
            <p>{d.texto}</p>
            <footer>
              <cite className="assinatura">{d.nome}</cite>
              <span className="destaque__detalhe">{d.detalhe}</span>
            </footer>
          </blockquote>
        </figure>

        <div className="relatos" role="list">
          {depoimentos.itens.map((r, i) => (
            <figure className="relato" role="listitem" key={r.nome} data-revelar style={{ '--d': `${i * 0.08}s` }}>
              <Estrelas />
              <blockquote>
                <p>{r.texto}</p>
              </blockquote>
              <figcaption>
                <span className="assinatura assinatura--menor">{r.nome}</span>
                <span className="relato__detalhe">{r.detalhe}</span>
              </figcaption>
            </figure>
          ))}
          <a className="relato relato--video" role="listitem" href={depoimentos.video.link} target="_blank" rel="noopener" data-revelar style={{ '--d': '0.24s' }}>
            <Foto nome={depoimentos.video.foto} alt="" sizes="(min-width: 960px) 300px, 80vw" />
            <span className="relato__play" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M8 5.5v13l10.5-6.5z" />
              </svg>
            </span>
            <span className="relato__video-texto">{depoimentos.video.texto}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
