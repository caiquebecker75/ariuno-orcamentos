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
    incluirWhiteLabel: boolean;
    valorWhiteLabel: number;
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
      usuarios: 20,
      ciclo: 'mensal',
      precoManual: false,
      precoPorUsuario: null,
      descontoPercentual: 0,
      motivoDesconto: '',
      incluirImplantacao: true,
      valorImplantacao: 3900,
      incluirWhiteLabel: false,
      valorWhiteLabel: 690,
      vigenciaMeses: 12,
    },
    condicoes: {
      validadeDias: 15,
      formaPagamento: 'Boleto bancário ou Pix',
      diaVencimento: 10,
      observacoes: '',
    },
    responsavel,
    incluirContrato: true,
  };
}
