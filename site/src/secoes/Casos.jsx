import { useCallback, useEffect, useRef, useState } from 'react'
import { casos } from '../dados/conteudo'
import { Foto, Palavras, Seta, Sobretitulo } from '../componentes/base'
import { gsap } from '../lib/rolagem'

/*
 * Antes e depois: o visitante arrasta a linha (ou usa as setas do teclado) para comparar.
 * Na primeira vez que o comparador aparece, e a cada troca de caso, a linha varre sozinha
 * do depois para o meio, mostrando que dá para arrastar.
 */
export default function Casos() {
  const [indice, setIndice] = useState(0)
  const [pos, setPos] = useState(50)
  const caixa = useRef(null)
  const estado = useRef({ v: 50 })
  const arrastando = useRef(false)
  const jaViu = useRef(false)
  const caso = casos.itens[indice]

  const varrer = useCallback(() => {
    gsap.killTweensOf(estado.current)
    estado.current.v = 92
    setPos(92)
    gsap.to(estado.current, {
      v: 50,
      duration: 1.3,
      ease: 'power3.inOut',
      delay: 0.15,
      onUpdate: () => setPos(estado.current.v),
    })
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !jaViu.current) {
          jaViu.current = true
          varrer()
        }
      },
      { threshold: 0.45 },
    )
    io.observe(caixa.current)
    return () => io.disconnect()
  }, [varrer])

  const trocar = (i) => {
    const n = (i + casos.itens.length) % casos.itens.length
    setIndice(n)
    varrer()
  }

  const moverPara = (clientX) => {
    const r = caixa.current.getBoundingClientRect()
    const v = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100))
    gsap.killTweensOf(estado.current)
    estado.current.v = v
    setPos(v)
  }

  const aoPressionar = (e) => {
    arrastando.current = true
    caixa.current.setPointerCapture?.(e.pointerId)
    moverPara(e.clientX)
  }
  const aoMover = (e) => arrastando.current && moverPara(e.clientX)
  const aoSoltar = () => (arrastando.current = false)

  const aoTecla = (e) => {
    const passo = e.shiftKey ? 10 : 4
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const v = Math.min(100, Math.max(0, pos + (e.key === 'ArrowLeft' ? -passo : passo)))
      estado.current.v = v
      setPos(v)
    }
  }

  return (
    <section className="casos secao secao--escura" id="casos" aria-labelledby="casos-titulo">
      <div className="conteudo">
        <div className="casos__topo">
          <div>
            <Sobretitulo claro>{casos.sobretitulo}</Sobretitulo>
            <h2 className="titulo-secao titulo-secao--claro casos__titulo" id="casos-titulo" data-revelar>
              <Palavras texto={casos.titulo[0]} />
              <br />
              <em>
                <Palavras texto={casos.titulo[1]} inicio={0.24} />
              </em>
            </h2>
          </div>
          <p className="lede lede--claro" data-revelar style={{ '--d': '0.2s' }}>
            {casos.texto}
          </p>
        </div>

        <div className="casos__corpo">
          <div className="casos__lado" data-revelar>
            <div className="casos__abas" role="tablist" aria-label="Escolha o caso">
              {casos.itens.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={i === indice}
                  aria-controls="comparador"
                  className={`aba ${i === indice ? 'ativa' : ''}`}
                  onClick={() => trocar(i)}
                >
                  <span className="aba__num">{String(i + 1).padStart(2, '0')}</span>
                  {c.nome}
                </button>
              ))}
            </div>
            <p key={caso.id} className="casos__texto">
              {caso.texto}
            </p>
            <div className="casos__setas">
              <button type="button" className="seta-botao" aria-label="Caso anterior" onClick={() => trocar(indice - 1)}>
                <Seta className="seta seta--esq" />
              </button>
              <button type="button" className="seta-botao" aria-label="Próximo caso" onClick={() => trocar(indice + 1)}>
                <Seta className="seta" />
              </button>
            </div>
          </div>

          <div className="casos__palco" data-revelar style={{ '--d': '0.1s' }}>
            <div
              className="comparador"
              id="comparador"
              ref={caixa}
              role="slider"
              tabIndex={0}
              aria-label={`Comparar antes e depois: ${caso.nome}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)}% antes`}
              onPointerDown={aoPressionar}
              onPointerMove={aoMover}
              onPointerUp={aoSoltar}
              onPointerCancel={aoSoltar}
              onKeyDown={aoTecla}
              style={{ '--pos': `${pos}%` }}
            >
              {casos.itens.map((c, i) => (
                <div className={`comparador__par ${i === indice ? 'ativo' : ''}`} key={c.id} aria-hidden={i !== indice}>
                  <Foto nome={`${c.id}-depois`} alt={`${c.nome}: depois do tratamento`} sizes="(min-width: 960px) 62vw, 94vw" className="comparador__depois" />
                  <div className="comparador__antes">
                    <Foto nome={`${c.id}-antes`} alt={`${c.nome}: antes do tratamento`} sizes="(min-width: 960px) 62vw, 94vw" />
                  </div>
                </div>
              ))}
              <span className="comparador__rotulo comparador__rotulo--antes">Antes</span>
              <span className="comparador__rotulo comparador__rotulo--depois">Depois</span>
              <span className="comparador__linha" aria-hidden="true">
                <span className="comparador__puxador">
                  <Seta className="seta seta--esq" />
                  <Seta className="seta" />
                </span>
              </span>
            </div>
            <p className="casos__aviso">{casos.aviso}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
