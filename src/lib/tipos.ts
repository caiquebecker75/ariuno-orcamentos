import type { Ciclo } from './preco';

export type Cliente = {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  endereco: string;
  contatoNome: string;
  contatoCargo: string;
  contatoEmail: string;
  contatoTelefone: string;
};

export type Proposta = {
  id: string;
  numero: string;
  criadoEm: string;
  atualizadoEm: string;
  status: 'rascunho' | 'enviada' | 'aceita' | 'recusada';
  cliente: Cliente;
  plano: {
    usuarios: number;
    ciclo: Ciclo;
    precoManual: boolean;
    precoPorUsuario: number | null;
    descontoPercentual: number;
    motivoDesconto: string;
    incluirImplantacao: boolean;
    valorImplantacao: number;
    implantacaoBonificada: boolean;
    incluirWhiteLabel: boolean;
    valorWhiteLabel: number;
    whiteLabelBonificado: boolean;
    vigenciaMeses: number;
  };
  condicoes: {
    validadeDias: number;
    formaPagamento: string;
    diaVencimento: number;
    observacoes: string;
  };
  responsavel: { nome: string; cargo: string; email: string; telefone: string };
  incluirContrato: boolean;
  incluirAnexoCnpj: boolean;
};

export const clienteVazio: Cliente = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  endereco: '',
  contatoNome: '',
  contatoCargo: '',
  contatoEmail: '',
  contatoTelefone: '',
};

export function propostaNova(numero: string, responsavel: Proposta['responsavel']): Proposta {
  const agora = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    numero,
    criadoEm: agora,
    atualizadoEm: agora,
    status: 'rascunho',
    cliente: { ...clienteVazio },
    plano: {
      usuarios: 10,
      ciclo: 'prazo',
      precoManual: false,
      precoPorUsuario: null,
      descontoPercentual: 0,
      motivoDesconto: '',
      incluirImplantacao: true,
      valorImplantacao: 3900,
      implantacaoBonificada: false,
      incluirWhiteLabel: false,
      valorWhiteLabel: 690,
      whiteLabelBonificado: false,
      vigenciaMeses: 6,
    },
    condicoes: {
      validadeDias: 15,
      formaPagamento: 'Boleto bancário ou Pix',
      diaVencimento: 10,
      observacoes: '',
    },
    responsavel,
    incluirContrato: true,
    incluirAnexoCnpj: true,
  };
}
