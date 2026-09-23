import { empresaPadrao, type Empresa } from '../conteudo/empresa';
import type { Proposta } from './tipos';

const CHAVE_PROPOSTAS = 'ariuno_orcamentos_propostas';
const CHAVE_EMPRESA = 'ariuno_orcamentos_empresa';
const CHAVE_SEQUENCIA = 'ariuno_orcamentos_sequencia';

function ler<T>(chave: string, padrao: T): T {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // navegador sem espaço ou em janela privada: o orçamento em tela continua válido
  }
}

export const lerPropostas = (): Proposta[] =>
  ler<Proposta[]>(CHAVE_PROPOSTAS, []).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

export function salvarProposta(proposta: Proposta) {
  const lista = ler<Proposta[]>(CHAVE_PROPOSTAS, []);
  const i = lista.findIndex((p) => p.id === proposta.id);
  const atualizada = { ...proposta, atualizadoEm: new Date().toISOString() };
  if (i >= 0) lista[i] = atualizada;
  else lista.push(atualizada);
  gravar(CHAVE_PROPOSTAS, lista);
  return atualizada;
}

export function excluirProposta(id: string) {
  gravar(
    CHAVE_PROPOSTAS,
    ler<Proposta[]>(CHAVE_PROPOSTAS, []).filter((p) => p.id !== id),
  );
}

export function importarPropostas(novas: Proposta[]) {
  const lista = ler<Proposta[]>(CHAVE_PROPOSTAS, []);
  const porId = new Map(lista.map((p) => [p.id, p]));
  novas.forEach((p) => porId.set(p.id, p));
  gravar(CHAVE_PROPOSTAS, [...porId.values()]);
}

export const lerEmpresa = (): Empresa => ({ ...empresaPadrao, ...ler<Partial<Empresa>>(CHAVE_EMPRESA, {}) });
export const salvarEmpresa = (empresa: Empresa) => gravar(CHAVE_EMPRESA, empresa);

/** Numeração sequencial por ano: ORC-2026-001. */
export function proximoNumero(): string {
  const ano = new Date().getFullYear();
  const estado = ler<{ ano: number; contador: number }>(CHAVE_SEQUENCIA, { ano, contador: 0 });
  const contador = estado.ano === ano ? estado.contador + 1 : 1;
  gravar(CHAVE_SEQUENCIA, { ano, contador });
  return `ORC-${ano}-${String(contador).padStart(3, '0')}`;
}
