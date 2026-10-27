import { espaco } from '../dados/conteudo'
import { Foto, Palavras, Sobretitulo } from '../componentes/base'

/* O espaço: as fotos reais do consultório em mosaico, cada uma com um leve deslocamento na rolagem. */
export default function Espaco() {
  const [grande, ...outras] = espaco.fotos
  return (
    <section className="espaco secao secao--escura" id="espaco" aria-labelledby="espaco-titulo">
      <div className="conteudo espaco__grade">
        <div className="espaco__texto">
          <Sobretitulo claro>{espaco.sobretitulo}</Sobretitulo>
          <h2 className="titulo-secao titulo-secao--claro" id="espaco-titulo" data-revelar>
            <Palavras texto={espaco.titulo[0]} />
            <br />
            <em>
              <Palavras texto={espaco.titulo[1]} inicio={0.2} />
            </em>
          </h2>
          <p className="lede lede--claro" data-revelar style={{ '--d': '0.2s' }}>
            {espaco.texto}
          </p>
          <blockquote className="espaco__citacao" data-revelar style={{ '--d': '0.3s' }}>
            <p>“{espaco.citacao.texto}”</p>
            <cite className="assinatura assinatura--menor">{espaco.citacao.nome}</cite>
          </blockquote>
        </div>

        <div className="mosaico">
          <figure className="mosaico__item mosaico__item--grande" data-revelar>
            <div data-paralaxe>
              <Foto nome={grande.nome} alt={grande.alt} sizes="(min-width: 960px) 52vw, 94vw" />
            </div>
          </figure>
          {outras.map((f, i) => (
            <figure className={`mosaico__item mosaico__item--${i + 1}`} key={f.nome} data-revelar style={{ '--d': `${0.08 * (i + 1)}s` }}>
              <div data-paralaxe-leve>
                <Foto nome={f.nome} alt={f.alt} sizes="(min-width: 960px) 26vw, 46vw" />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
