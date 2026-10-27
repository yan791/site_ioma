import { useState } from 'react'
import { agendar, contato } from '../dados/conteudo'
import { IconeWhats, Palavras, Seta, Sobretitulo } from '../componentes/base'
import { Marca } from '../componentes/Marca'

/*
 * Agendamento sem formulário de servidor: o visitante escolhe o assunto, escreve o nome
 * (opcional) e a mensagem pronta abre no WhatsApp do IOMA. Ele envia de lá.
 */
export default function Agendar() {
  const [nome, setNome] = useState('')
  const [assunto, setAssunto] = useState('')

  const mensagem = () => {
    let m = 'Olá! '
    if (nome.trim()) m += `Meu nome é ${nome.trim()}. `
    m += 'Vim pelo site do IOMA e gostaria de agendar uma consulta'
    m += assunto && assunto !== 'Ainda não sei' ? ` sobre ${assunto.toLowerCase()}.` : '.'
    return m
  }

  const enviar = (e) => {
    e.preventDefault()
    window.open(contato.linkWhatsapp(mensagem()), '_blank', 'noopener')
  }

  return (
    <section className="agendar secao" id="contato" aria-labelledby="agendar-titulo">
      <div className="conteudo agendar__grade">
        <div className="agendar__cartao">
          <Marca className="agendar__marca" girar />
          <Sobretitulo claro>{agendar.sobretitulo}</Sobretitulo>
          <h2 className="titulo-secao titulo-secao--claro" id="agendar-titulo" data-revelar>
            <Palavras texto={agendar.titulo[0]} />
            <br />
            <em>
              <Palavras texto={agendar.titulo[1]} inicio={0.2} />
            </em>
          </h2>
          <p className="lede lede--claro" data-revelar style={{ '--d': '0.2s' }}>
            {agendar.texto}
          </p>

          <form className="formulario" onSubmit={enviar} data-revelar style={{ '--d': '0.3s' }}>
            <fieldset className="formulario__assuntos">
              <legend>O que você procura?</legend>
              {agendar.opcoes.map((o) => (
                <label key={o} className={`chip ${assunto === o ? 'ativo' : ''}`}>
                  <input type="radio" name="assunto" value={o} checked={assunto === o} onChange={() => setAssunto(o)} />
                  {o}
                </label>
              ))}
            </fieldset>
            <label className="formulario__campo">
              <span>Seu nome (opcional)</span>
              <input type="text" name="nome" autoComplete="given-name" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como podemos te chamar?" />
            </label>
            <button type="submit" className="botao botao--terracota botao--largo">
              <IconeWhats className="botao__icone" />
              Continuar no WhatsApp
            </button>
            <p className="formulario__nota">A conversa abre no WhatsApp com a mensagem pronta. Você revisa e envia.</p>
          </form>
        </div>

        <div className="agendar__info">
          <div className="info" data-revelar>
            <h3>Onde estamos</h3>
            <p>
              {contato.endereco.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
              <small>{contato.referencia}</small>
            </p>
            <a className="link-seta" href={contato.mapa} target="_blank" rel="noopener">
              Como chegar <Seta className="seta" />
            </a>
          </div>
          <div className="info" data-revelar style={{ '--d': '0.08s' }}>
            <h3>Fale com a equipe</h3>
            <p>
              <a href={contato.linkWhatsapp()} target="_blank" rel="noopener">
                WhatsApp {contato.whatsappTexto}
              </a>
              <br />
              <a href={`mailto:${contato.email}`}>{contato.email}</a>
            </p>
          </div>
          <div className="info" data-revelar style={{ '--d': '0.16s' }}>
            <h3>Acompanhe</h3>
            <p>
              <a href={contato.instagram} target="_blank" rel="noopener">
                Instagram {contato.instagramUsuario}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
