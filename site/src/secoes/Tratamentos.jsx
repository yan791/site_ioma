import { useEffect, useRef, useState } from 'react'
import { contato, tratamentos } from '../dados/conteudo'
import { Foto, Palavras, Seta, Sobretitulo } from '../componentes/base'

/*
 * Lista editorial: passar o mouse (ou tocar) num tratamento troca a foto ao lado.
 * Sem interação, a lista avança sozinha devagar enquanto está na tela.
 */
export default function Tratamentos() {
  const [ativo, setAtivo] = useState(0)
  const [visivel, setVisivel] = useState(false)
  const mexeu = useRef(0)
  const raiz = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.25 })
    io.observe(raiz.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visivel) return
    const id = setInterval(() => {
      if (performance.now() - mexeu.current < 6000) return
      setAtivo((a) => (a + 1) % tratamentos.itens.length)
    }, 3800)
    return () => clearInterval(id)
  }, [visivel])

  const escolher = (i) => {
    mexeu.current = performance.now()
    setAtivo(i)
  }

  return (
    <section className="tratamentos secao" id="tratamentos" ref={raiz} aria-labelledby="tratamentos-titulo">
      <div className="conteudo tratamentos__grade">
        <div className="tratamentos__lado">
          <Sobretitulo>{tratamentos.sobretitulo}</Sobretitulo>
          <h2 className="titulo-secao" id="tratamentos-titulo" data-revelar>
            <Palavras texto={tratamentos.titulo} />
          </h2>
          <p className="lede" data-revelar style={{ '--d': '0.2s' }}>
            {tratamentos.texto}
          </p>
          <div className="tratamentos__moldura" data-revelar aria-hidden="true">
            {tratamentos.itens.map((t, i) => (
              <Foto
                key={t.nome}
                nome={t.foto}
                alt=""
                sizes="(min-width: 960px) 34vw, 90vw"
                className={i === ativo ? 'ativa' : ''}
              />
            ))}
            <span className="tratamentos__contador">
              {String(ativo + 1).padStart(2, '0')} <i /> {String(tratamentos.itens.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        <ol className="tratamentos__lista">
          {tratamentos.itens.map((t, i) => (
            <li
              key={t.nome}
              className={`tratamento ${i === ativo ? 'ativo' : ''}`}
              data-revelar
              style={{ '--d': `${0.06 * i}s` }}
              onMouseEnter={() => escolher(i)}
              onFocus={() => escolher(i)}
              onClick={() => escolher(i)}
              tabIndex={0}
            >
              <span className="tratamento__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="tratamento__corpo">
                <h3 className="tratamento__nome">{t.nome}</h3>
                <p className="tratamento__texto">{t.texto}</p>
              </div>
              <span className="tratamento__linha" aria-hidden="true" />
            </li>
          ))}
          <li className="tratamentos__urgencia" data-revelar>
            <a href={contato.linkWhatsapp('Olá! Estou com uma urgência odontológica e gostaria de atendimento no IOMA.')} target="_blank" rel="noopener">
              {tratamentos.urgencia}
              <Seta className="seta" />
            </a>
          </li>
        </ol>
      </div>
    </section>
  )
}
