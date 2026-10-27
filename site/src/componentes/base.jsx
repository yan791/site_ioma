import { Fragment } from 'react'
import { imagens } from '../dados/conteudo'

/** Palavras que sobem de dentro de uma máscara quando o bloco entra na tela. */
export function Palavras({ texto, inicio = 0, passo = 0.06 }) {
  const lista = texto.split(' ')
  // o espaço fica fora da máscara: dentro de um inline-block ele seria descartado
  return lista.map((p, i) => (
    <Fragment key={i}>
      <span className="palavra">
        <span style={{ '--d': `${(inicio + i * passo).toFixed(3)}s` }}>{p}</span>
      </span>
      {i < lista.length - 1 ? ' ' : ''}
    </Fragment>
  ))
}

/** Imagem responsiva a partir do mapa gerado por ferramentas/imagens.py */
export function Foto({ nome, alt, sizes = '100vw', className = '', prioridade = false, ...resto }) {
  const v = imagens[nome]
  if (!v) return null
  const maior = v[v.length - 1]
  return (
    <img
      className={className}
      src={maior.src}
      srcSet={v.map((x) => `${x.src} ${x.w}w`).join(', ')}
      sizes={sizes}
      width={maior.w}
      height={maior.h}
      alt={alt}
      loading={prioridade ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={prioridade ? 'high' : undefined}
      {...resto}
    />
  )
}

export function Sobretitulo({ children, claro = false }) {
  return (
    <p className={`sobretitulo ${claro ? 'sobretitulo--claro' : ''}`} data-revelar>
      <span className="sobretitulo__traco" aria-hidden="true" />
      {children}
    </p>
  )
}

export function IconeWhats(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.6-.5-1-1.1-1.4-1.8-.1-.2 0-.4.1-.5l.4-.4.3-.4v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
      />
    </svg>
  )
}

export function Seta(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

export function Estrelas({ className = '' }) {
  return (
    <span className={`estrelas ${className}`} aria-label="5 de 5 estrelas" role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true" style={{ '--i': i }}>
          <path fill="currentColor" d="m12 2.8 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
        </svg>
      ))}
    </span>
  )
}
