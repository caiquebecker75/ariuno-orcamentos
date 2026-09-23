/**
 * Dados da empresa que assina o contrato, tirados do cartão CNPJ da 75 LAB.
 * Dá para ajustar na tela de Configurações; o que for digitado lá fica salvo no
 * navegador e passa a valer para todos os orçamentos.
 */
export const empresaPadrao = {
  marca: 'Ariuno',
  plataformaUrl: 'ariuno.com.br',
  siteUrl: 'conheca.ariuno.com.br',
  razaoSocial: '75 LAB ESTRATÉGIA, DESIGN E PRODUÇÃO LTDA',
  nomeFantasia: '75 LAB',
  cnpj: '55.470.982/0001-77',
  endereco: 'Rua Jurubatuba, 1350, conjunto 913, Centro, São Bernardo do Campo, SP, CEP 09725-000',
  email: 'contato@75lab.com.br',
  telefone: '(11) 8864-8434',
  foro: 'São Bernardo do Campo, Estado de São Paulo',
  responsavel: {
    nome: '',
    cargo: 'Comercial',
    email: 'contato@75lab.com.br',
    telefone: '',
  },
};

export type Empresa = typeof empresaPadrao;
