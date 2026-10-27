import { metodo } from '../dados/conteudo'
import { Foto, Palavras, Sobretitulo } from '../componentes/base'
import { Simbolo } from '../componentes/Marca'

/* Como funciona: foto larga do atendimento e quatro passos ligados por uma linha que se desenha. */
export default function Metodo() {
  return (
    <section className="metodo secao" id="metodo" aria-labelledby="metodo-titulo">
      <div className="conteudo">
        <div className="metodo__topo">
          <Sobretitulo>{metodo.sobretitulo}</Sobretitulo>
          <h2 className="titulo-secao metodo__titulo" id="metodo-titulo" data-revelar>
            <Palavras texto={metodo.titulo} passo={0.04} />
          </h2>
        </div>

        <figure className="metodo__foto" data-revelar>
          <div className="metodo__foto-mascara" data-paralaxe>
            <Foto nome="consultorio-sala" alt="Consultório do IOMA no fim de tarde, pronto para o próximo atendimento" sizes="(min-width: 1240px) 1180px, 94vw" />
          </div>
          <figcaption>
            <Simbolo className="metodo__selo" />
            Planejamento, técnica e cuidado em cada etapa
          </figcaption>
        </figure>

        <ol className="metodo__passos" data-revelar>
          <span className="metodo__trilho" aria-hidden="true">
            <i />
          </span>
          {metodo.passos.map((p, i) => (
            <li className="passo" key={p.nome} style={{ '--i': i }}>
              <span className="passo__marca" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="passo__nome">{p.nome}</h3>
              <p className="passo__texto">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
