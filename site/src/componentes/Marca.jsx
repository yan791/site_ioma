import { useId } from 'react'

/*
 * O símbolo do IOMA redesenhado em vetor a partir do logo do Instagram:
 * haste central com ponta em lança, duas folhas em meia-lua e duas folhas baixas.
 * viewBox 100 x 116. "traco" desenha só o contorno (para animar), "cheio" preenche.
 */
export const CAMINHOS_SIMBOLO = [
  'M50 2.7C52.4 10 53.6 17 50 26.7C46.4 17 47.6 10 50 2.7Z',
  'M50 24V113',
  'M37.3 30C24 46 18 70 46.7 96.7C32 76 30 52 37.3 30Z',
  'M62.7 30C76 46 82 70 53.3 96.7C68 76 70 52 62.7 30Z',
  'M48.3 111.7C34 96 20 86 5 82.7C18 98 32 108 48.3 111.7Z',
  'M51.7 111.7C66 96 80 86 95 82.7C82 98 68 108 51.7 111.7Z',
]

export function Simbolo({ modo = 'cheio', className = '', espessura = 0.6, ...resto }) {
  return (
    <svg viewBox="0 0 100 116" className={`simbolo simbolo--${modo} ${className}`} aria-hidden="true" {...resto}>
      {CAMINHOS_SIMBOLO.map((d, i) =>
        i === 1 ? (
          <path key={i} d={d} pathLength="1" fill="none" stroke="currentColor" strokeWidth={modo === 'cheio' ? 2.2 : espessura} strokeLinecap="round" style={{ '--i': i }} />
        ) : (
          <path
            key={i}
            d={d}
            pathLength="1"
            fill={modo === 'cheio' ? 'currentColor' : 'none'}
            stroke={modo === 'cheio' ? 'none' : 'currentColor'}
            strokeWidth={espessura}
            strokeLinejoin="round"
            style={{ '--i': i }}
          />
        ),
      )}
    </svg>
  )
}

/** Logo circular: nome em volta do símbolo, como no perfil do Instagram. */
export function Marca({ className = '', girar = false, rotulo = 'IOMA Instituto Odontológico Melo Aragão' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 200 200" className={`marca ${girar ? 'marca--gira' : ''} ${className}`} role="img" aria-label={rotulo}>
      <defs>
        <path id={`topo-${id}`} d="M28 100a72 72 0 0 1 144 0" />
        <path id={`base-${id}`} d="M34 104a66 66 0 0 0 132 0" />
      </defs>
      <g className="marca__anel">
        <text className="marca__texto">
          <textPath href={`#topo-${id}`} startOffset="50%" textAnchor="middle">
            INSTITUTO ODONTOLÓGICO
          </textPath>
        </text>
        <text className="marca__texto">
          <textPath href={`#base-${id}`} startOffset="50%" textAnchor="middle">
            MELO ARAGÃO
          </textPath>
        </text>
      </g>
      <g transform="translate(70 62) scale(0.6)">
        {CAMINHOS_SIMBOLO.map((d, i) =>
          i === 1 ? (
            <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          ) : (
            <path key={i} d={d} fill="currentColor" />
          ),
        )}
      </g>
    </svg>
  )
}

/** Texto em anel que gira devagar (o nome do instituto em volta do dente 3D). */
export function Anel({ texto, className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 400 400" className={`anel ${className}`} aria-hidden="true">
      <defs>
        <path id={`anel-${id}`} d="M200 200m-182 0a182 182 0 1 1 364 0a182 182 0 1 1-364 0" />
      </defs>
      <text className="anel__texto">
        <textPath href={`#anel-${id}`} textLength="1140" lengthAdjust="spacing">
          {texto}
        </textPath>
      </text>
    </svg>
  )
}
