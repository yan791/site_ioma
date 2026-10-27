import { equipe } from '../dados/conteudo'
import { Foto, Palavras, Sobretitulo } from '../componentes/base'

/* Equipe: o Dr. Guilherme em destaque, com retrato em arco (a forma das folhas do símbolo). */
export default function Equipe() {
  const [dr, ...outros] = equipe.pessoas
  return (
    <section className="equipe secao" id="equipe" aria-labelledby="equipe-titulo">
      <div className="conteudo">
        <div className="equipe__cabeca">
          <Sobretitulo>{equipe.sobretitulo}</Sobretitulo>
          <h2 className="titulo-secao" id="equipe-titulo" data-revelar>
            <Palavras texto={equipe.titulo} />
          </h2>
        </div>

        <article className="pessoa pessoa--destaque">
          <div className="pessoa__fotos" data-revelar>
            <div className="arco arco--grande" data-paralaxe-leve>
              <Foto nome={dr.foto} alt={`${dr.nome} no consultório do IOMA`} sizes="(min-width: 960px) 40vw, 88vw" />
            </div>
            <div className="arco arco--mini">
              <Foto nome={dr.fotoExtra} alt="" sizes="200px" />
            </div>
          </div>
          <div className="pessoa__texto">
            <p className="pessoa__apelido" data-revelar>
              {dr.apelido}
            </p>
            <h3 className="pessoa__nome" data-revelar style={{ '--d': '0.08s' }}>
              {dr.nome}
            </h3>
            <p className="pessoa__area" data-revelar style={{ '--d': '0.14s' }}>
              {dr.area} <span aria-hidden="true">·</span> {dr.cro}
            </p>
            <p className="pessoa__bio" data-revelar style={{ '--d': '0.2s' }}>
              {dr.texto}
            </p>
          </div>
        </article>

        {outros.map((p) => (
          <article className="pessoa pessoa--card" key={p.nome} data-revelar>
            <div className="arco arco--card">
              <Foto nome={p.foto} alt={p.nome} sizes="(min-width: 960px) 220px, 40vw" />
            </div>
            <div>
              <h3 className="pessoa__nome pessoa__nome--menor">{p.nome}</h3>
              <p className="pessoa__area">
                {p.area} <span aria-hidden="true">·</span> {p.cro}
              </p>
              <p className="pessoa__bio">{p.texto}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
