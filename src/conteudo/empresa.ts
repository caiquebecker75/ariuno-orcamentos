/**
 * Dados da empresa que assina o contrato e da plataforma.
 * O que estiver marcado como PREENCHER precisa ser completado uma vez, na tela
 * de Configurações do gerador. O valor digitado lá fica salvo no navegador e
 * passa a valer para todos os orçamentos.
 */
export const empresaPadrao = {
  marca: 'Ariuno',
  plataformaUrl: 'ariuno.com.br',
  siteUrl: 'conheca.ariuno.com.br',
  razaoSocial: '[PREENCHER: razão social da 75 LAB]',
  nomeFantasia: '75 LAB',
  cnpj: '[PREENCHER: CNPJ]',
  endereco: '[PREENCHER: endereço completo, cidade e estado]',
  email: 'contato@setecincolab.com.br',
  telefone: '',
  foro: 'São Paulo, Estado de São Paulo',
  responsavel: {
    nome: '',
    cargo: 'Comercial',
    email: 'contato@setecincolab.com.br',
    telefone: '',
  },
};

export type Empresa = typeof empresaPadrao;
