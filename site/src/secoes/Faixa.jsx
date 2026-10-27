import { faixa } from '../dados/conteudo'
import { Simbolo } from '../componentes/Marca'

/* Faixa de tratamentos que desliza devagar entre a abertura e a página. */
export default function Faixa() {
  const grupo = (copia) => (
    <div className="faixa__grupo" aria-hidden={copia || undefined}>
      {faixa.map((t) => (
        <span className="faixa__item" key={t}>
          {t}
          <Simbolo className="faixa__simbolo" />
        </span>
      ))}
    </div>
  )
  return (
    <div className="faixa" role="region" aria-label="Tratamentos oferecidos">
      <div className="faixa__trilho">
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  )
}
