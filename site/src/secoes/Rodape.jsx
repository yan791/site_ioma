import { contato, menu, rodape } from '../dados/conteudo'
import { Marca } from '../componentes/Marca'

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="conteudo rodape__grade">
        <Marca className="rodape__marca" girar />
        <div className="rodape__colunas">
          <nav aria-label="Rodapé">
            {menu.map((m) => (
              <a key={m.href} href={m.href}>
                {m.nome}
              </a>
            ))}
          </nav>
          <p>
            {contato.endereco.map((l) => (
              <span key={l}>
                {l}
                <br />
              </span>
            ))}
          </p>
          <p>
            <a href={contato.linkWhatsapp()} target="_blank" rel="noopener">
              {contato.whatsappTexto}
            </a>
            <br />
            <a href={contato.instagram} target="_blank" rel="noopener">
              {contato.instagramUsuario}
            </a>
          </p>
        </div>
      </div>
      <div className="conteudo rodape__base">
        <span>{rodape.responsavel}</span>
        <span>© {new Date().getFullYear()} IOMA Instituto Odontológico Melo Aragão</span>
        <a href="#inicio">Voltar ao topo ↑</a>
      </div>
    </footer>
  )
}
