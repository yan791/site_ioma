/*
 * Todo o texto e os contatos do site ficam aqui.
 * Fonte: Instagram @ioma.instituto, bio.site/IOMA e o perfil do Google (conferidos em 27/10/2026).
 * Itens marcados como "confirmar" estão no arquivo ioma/PENDENCIAS.md.
 */
import imagens from './imagens.json'

export { imagens }

const WHATSAPP = '5581988062409'
const MENSAGEM = 'Olá! Vim pelo site do IOMA e gostaria de agendar uma consulta.'

export const contato = {
  whatsapp: WHATSAPP,
  whatsappTexto: '(81) 98806-2409',
  linkWhatsapp: (texto = MENSAGEM) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`,
  email: 'institutoodontologicoma@gmail.com',
  instagram: 'https://www.instagram.com/ioma.instituto/',
  instagramUsuario: '@ioma.instituto',
  avaliacoesGoogle: 'https://share.google/I9OgAaR8xnrJxvJcA',
  mapa: 'https://www.google.com/maps/search/?api=1&query=IOMA+Instituto+Odontol%C3%B3gico+Melo+Arag%C3%A3o+RioMar+Trade+Center',
  endereco: ['RioMar Trade Center, Torre 3, Sala 1410', 'Av. República Árabe Unida, 251, Pina', 'Recife, PE, 51110-150'],
  referencia: 'No complexo do Shopping RioMar',
}

export const nota = { valor: '5,0', total: 27 }

export const menu = [
  { href: '#implante', nome: 'Implantes' },
  { href: '#tratamentos', nome: 'Tratamentos' },
  { href: '#casos', nome: 'Casos reais' },
  { href: '#equipe', nome: 'Equipe' },
  { href: '#depoimentos', nome: 'Depoimentos' },
  { href: '#contato', nome: 'Contato' },
]

export const hero = {
  sobretitulo: 'Instituto Odontológico Melo Aragão · Recife',
  titulo: ['Acolhimento', 'e excelência', 'em cada'],
  destaque: 'sorriso.',
  texto:
    'Implantes, reabilitação oral e estética com tecnologia, precisão e cuidado individualizado, do diagnóstico ao resultado.',
}

export const implante = {
  sobretitulo: 'Tecnologia e precisão',
  titulo: ['Cada peça,', 'planejada para você.'],
  texto:
    'O implante substitui a raiz, o pilar faz a conexão e a coroa devolve forma e cor ao sorriso. Toque em "Ver por dentro" e gire o dente para conhecer cada parte.',
}

export const espaco = {
  sobretitulo: 'O espaço',
  titulo: ['Um consultório', 'com vista para Recife.'],
  texto: 'No RioMar Trade Center, com luz natural, vista para a cidade e um ambiente calmo do começo ao fim da consulta.',
  citacao: { texto: 'O espaço é maravilhoso. Me senti bem acolhida.', nome: 'Vaneide' },
  fotos: [
    { nome: 'consultorio-vista', alt: 'Cadeira odontológica de frente para a janela com vista para Recife no fim de tarde' },
    { nome: 'consultorio-bancada', alt: 'Consultório do IOMA com a bancada e a cadeira iluminadas pelo sol' },
    { nome: 'recepcao', alt: 'Recepção do IOMA, sala 1410 do RioMar Trade Center' },
    { nome: 'consultorio-anoitecer', alt: 'O consultório ao anoitecer, com as luzes da cidade pela janela' },
  ],
}

export const pecas = [
  { titulo: 'Implante', texto: 'Base em titânio que se integra ao osso e substitui a raiz.' },
  { titulo: 'Pilar', texto: 'Conecta o implante à coroa com encaixe preciso.' },
  { titulo: 'Coroa', texto: 'Forma, cor e brilho pensados para parecer natural.' },
]

export const faixa = [
  'Implantes dentários',
  'Prótese protocolo',
  'Reabilitação oral',
  'Coroas de porcelana',
  'Resina composta',
  'Retratamento de canal',
  'Extração de siso',
  'Urgências',
]

export const tratamentos = {
  sobretitulo: 'Tratamentos',
  titulo: 'Dos casos mais simples aos mais complexos.',
  texto: 'Cada paciente recebe um tratamento pensado de forma individual, com planejamento, cuidado e atenção em cada etapa.',
  itens: [
    {
      nome: 'Implantes dentários',
      texto: 'Devolvem estabilidade, segurança e qualidade de vida, para voltar a comer e sorrir com confiança.',
      foto: 'procedimento',
    },
    {
      nome: 'Prótese protocolo',
      texto: 'Dentes fixos sobre implantes para quem perdeu vários ou todos os dentes. Mastigação, conforto e autoestima de volta.',
      foto: 'protocolo-depois',
    },
    {
      nome: 'Reabilitação oral',
      texto: 'Planejamento completo para recuperar função, saúde e harmonia do sorriso, uma etapa de cada vez.',
      foto: 'provisorio-depois',
    },
    {
      nome: 'Estética em resina',
      texto: 'Acréscimos e reconstruções em resina composta que respeitam a anatomia e a naturalidade de cada sorriso.',
      foto: 'acrescimos-depois',
    },
    {
      nome: 'Coroas de porcelana',
      texto: 'Resistência e acabamento natural para dentes que precisam de reforço, como depois de um tratamento de canal.',
      foto: 'coroa-depois',
    },
    {
      nome: 'Canal e cirurgias',
      texto: 'Retratamento de canal para preservar o dente natural e extração de siso com acompanhamento no pós-operatório.',
      foto: 'dr-guilherme-caso',
    },
  ],
  urgencia: 'Quebrou um dente ou está com dor? Fale com a equipe pelo WhatsApp.',
}

export const casos = {
  sobretitulo: 'Casos reais',
  titulo: ['Por trás de cada sorriso,', 'uma história.'],
  texto: 'Arraste a linha para comparar o antes e o depois de pacientes do IOMA.',
  aviso: 'Os resultados variam de acordo com cada caso e dependem de avaliação individual.',
  itens: [
    {
      id: 'protocolo',
      nome: 'Prótese protocolo',
      texto: 'Devolver dentes é devolver muito mais do que estética: é resgatar mastigação, conforto e autoestima.',
    },
    {
      id: 'provisorio',
      nome: 'Protocolo provisório',
      texto: 'Dentes fixos desde o início do tratamento, com conforto e segurança enquanto a prótese definitiva é planejada.',
    },
    {
      id: 'coroa',
      nome: 'Coroa de porcelana',
      texto: 'O dente chegou praticamente condenado. Com retratamento de canal e coroa de porcelana, ele foi preservado.',
    },
    {
      id: 'fratura',
      nome: 'Reconstrução em resina',
      texto: 'Depois de quebrar um dente da frente, o paciente recebeu uma reconstrução em resina no atendimento de urgência.',
    },
    {
      id: 'acrescimos',
      nome: 'Acréscimos em resina',
      texto: 'Pequenos acréscimos para melhorar contorno e proporção. Sem exageros, só os detalhes que fazem diferença.',
    },
  ],
}

export const metodo = {
  sobretitulo: 'Como funciona',
  titulo: 'A excelência está nos detalhes que o paciente nem sempre vê.',
  passos: [
    { nome: 'Consulta e diagnóstico', texto: 'Entendemos a origem do problema e avaliamos todas as possibilidades para o seu caso.' },
    { nome: 'Planejamento individual', texto: 'Cada etapa é explicada com clareza: o tratamento, o tempo e os cuidados.' },
    { nome: 'Tratamento', texto: 'Técnica e tecnologia em cada procedimento, com atenção especial a quem chega com medo.' },
    { nome: 'Acompanhamento', texto: 'Ajustes, provisórios e revisões até o resultado definitivo, com suporte no pós-operatório.' },
  ],
}

export const equipe = {
  sobretitulo: 'Equipe',
  titulo: 'Quem cuida do seu sorriso',
  pessoas: [
    {
      nome: 'Dr. Guilherme de Melo Aragão',
      apelido: 'Dr. Gui',
      area: 'Reabilitação oral',
      cro: 'CRO/PE 17191',
      texto:
        'Cirurgião-dentista à frente do IOMA. Atua com implantes, prótese protocolo e reabilitação oral, do planejamento ao resultado definitivo.',
      foto: 'dr-guilherme',
      fotoExtra: 'dr-gui-cafe',
    },
    {
      nome: 'Dra. Júlia Brito',
      area: 'Cirurgiã-dentista',
      cro: 'CRO/PE 22367',
      texto: 'Cirurgiã-dentista da equipe, com atendimento próximo e planejamento feito junto com cada paciente.',
      foto: 'dra-julia',
    },
  ],
}

export const depoimentos = {
  sobretitulo: 'Depoimentos',
  titulo: 'O que dizem os pacientes',
  destaque: {
    nome: 'Vaneide',
    foto: 'vaneide',
    texto:
      'Só tenho a agradecer por ter conhecido esses dois profissionais competentes, comprometidos e, acima de tudo, dedicados e amáveis. A clareza nas explicações do andamento do tratamento é impressionante. Me senti bem acolhida. E agora meu sorriso é outro!',
    detalhe: 'Implantes e retratamento de canal',
  },
  itens: [
    {
      nome: 'Maria Helena',
      texto:
        'Já havia passado por situações desagradáveis com outros dentistas e me sentia insegura. Desde o primeiro atendimento, percebi um profissionalismo e uma clareza que me transmitiram total confiança. A cirurgia foi rápida e indolor.',
      detalhe: 'Extração de siso',
    },
    {
      nome: 'Sizenando',
      texto:
        'Faz pelo menos 30 anos que tenho esse dente quebrado. Já fiz inúmeras restaurações, e nenhuma ficou tão boa quanto a de hoje. Parece que o dente nunca foi quebrado.',
      detalhe: 'Restauração',
    },
    {
      nome: 'Flávia',
      texto: 'Um ótimo profissional, bastante atencioso. Precisei fazer um implante e foi perfeito. A localização é ótima e o espaço, bem acolhedor.',
      detalhe: 'Implante',
    },
  ],
  video: {
    foto: 'paciente-depoimento',
    texto: 'Ele chegou ao IOMA querendo recuperar a segurança para sorrir e mastigar. Assista ao relato no Instagram.',
    link: 'https://www.instagram.com/ioma.instituto/reel/DcT7pxOJMKf/',
  },
}

export const agendar = {
  sobretitulo: 'Agende sua consulta',
  titulo: ['O primeiro passo', 'é uma conversa.'],
  texto: 'Conte o que você sente ou o que gostaria de mudar no seu sorriso. A equipe responde pelo WhatsApp e encontra o melhor horário para você.',
  opcoes: ['Implantes', 'Prótese protocolo', 'Estética do sorriso', 'Canal ou coroa', 'Urgência', 'Ainda não sei'],
}

export const rodape = {
  responsavel: 'Responsável técnico: Dr. Guilherme de Melo Aragão · CRO/PE 17191',
}
