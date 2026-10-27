import { useEffect, useState } from 'react'
import { contato, menu } from '../dados/conteudo'
import { Marca, Simbolo } from './Marca'
import { IconeWhats } from './base'
import { travarRolagem } from '../lib/rolagem'

export default function Cabecalho() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    travarRolagem(aberto)
    if (!aberto) return
    const aoTecla = (e) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', aoTecla)
    return () => window.removeEventListener('keydown', aoTecla)
  }, [aberto])

  return (
    <header className={`cabecalho ${rolou ? 'cabecalho--rolou' : ''} ${aberto ? 'cabecalho--menu' : ''}`}>
      <a className="pular" href="#principal">
        Pular para o conteúdo
      </a>
      <div className="cabecalho__barra conteudo">
        <a className="cabecalho__marca" href="#inicio" aria-label="IOMA, voltar ao início">
          <Marca className="cabecalho__logo" />
          <span className="cabecalho__nome">
            IOMA
            <small>Instituto Odontológico Melo Aragão</small>
          </span>
        </a>
        <nav className="cabecalho__nav" aria-label="Principal">
          {menu.map((m) => (
            <a key={m.href} href={m.href}>
              {m.nome}
            </a>
          ))}
        </nav>
        <a className="botao botao--terracota botao--pequeno cabecalho__cta" href={contato.linkWhatsapp()} target="_blank" rel="noopener">
          <IconeWhats className="botao__icone" />
          <span>Agendar consulta</span>
        </a>
        <button
          type="button"
          className="cabecalho__abrir"
          aria-expanded={aberto}
          aria-controls="menu-movel"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setAberto(!aberto)}
        >
          <i />
          <i />
        </button>
      </div>

      <div className="menu-movel" id="menu-movel" hidden={!aberto}>
        <Simbolo modo="traco" className="menu-movel__simbolo" espessura={0.3} />
        <nav aria-label="Menu">
          {menu.map((m, i) => (
            <a key={m.href} href={m.href} style={{ '--i': i }} onClick={() => setAberto(false)}>
              {m.nome}
            </a>
          ))}
        </nav>
        <a className="botao botao--terracota" href={contato.linkWhatsapp()} target="_blank" rel="noopener" onClick={() => setAberto(false)}>
          <IconeWhats className="botao__icone" />
          Agendar consulta
        </a>
        <p className="menu-movel__info">
          {contato.endereco[0]}
          <br />
          {contato.whatsappTexto}
        </p>
      </div>
    </header>
  )
}
