/**
 * Tabela de preços do Ariuno por faixa de usuários.
 * Cada faixa tem dois preços: um para quem fecha com prazo (a partir de 6 meses)
 * e outro para quem fica no mensal, sem compromisso de permanência.
 */
export const FAIXAS = [
  { de: 1, ate: 5, rotulo: 'até 5 usuários', prazo: 179, mensal: 199 },
  { de: 6, ate: 10, rotulo: '6 a 10 usuários', prazo: 159, mensal: 179 },
  { de: 11, ate: 15, rotulo: '11 a 15 usuários', prazo: 139, mensal: 159 },
  { de: 16, ate: 99999, rotulo: 'acima de 15 usuários', prazo: 119, mensal: 139 },
] as const;

/** Prazo mínimo para valer o preço com fidelidade. */
export const MESES_MINIMOS_PRAZO = 6;
export const IMPLANTACAO_PADRAO = 3900;
export const WHITE_LABEL_PADRAO = 690;

/** `prazo` = fecha por um número de meses · `mensal` = sem fidelidade */
export type Ciclo = 'prazo' | 'mensal';

export type Orcamento = {
  usuarios: number;
  ciclo: Ciclo;
  precoPorUsuario: number | null;
  precoManual: boolean;
  descontoPercentual: number;
  incluirImplantacao: boolean;
  valorImplantacao: number;
  implantacaoBonificada: boolean;
  incluirWhiteLabel: boolean;
  valorWhiteLabel: number;
  whiteLabelBonificado: boolean;
  vigenciaMeses: number;
};

export function faixaDe(usuarios: number) {
  const n = Math.max(1, usuarios);
  return FAIXAS.find((f) => n >= f.de && n <= f.ate) ?? FAIXAS[FAIXAS.length - 1];
}

export const precoDaFaixa = (usuarios: number, ciclo: Ciclo) =>
  ciclo === 'prazo' ? faixaDe(usuarios).prazo : faixaDe(usuarios).mensal;

export type Calculo = ReturnType<typeof calcular>;

export function calcular(o: Orcamento) {
  const usuarios = Math.max(1, Math.round(o.usuarios || 0));
  const faixa = faixaDe(usuarios);
  const tabela = o.ciclo === 'prazo' ? faixa.prazo : faixa.mensal;
  const tabelaOutroCiclo = o.ciclo === 'prazo' ? faixa.mensal : faixa.prazo;
  const cheio = o.precoManual && o.precoPorUsuario !== null ? o.precoPorUsuario : tabela;

  const descontoPercentual = Math.min(100, Math.max(0, o.descontoPercentual || 0));
  const porUsuario = cheio * (1 - descontoPercentual / 100);

  const mensalidadeCheia = cheio * usuarios;
  const mensalidade = porUsuario * usuarios;
  const descontoMensal = mensalidadeCheia - mensalidade;

  // bonificado aparece na proposta com o valor, mas não entra na conta
  const whiteLabelValor = o.incluirWhiteLabel ? o.valorWhiteLabel : 0;
  const whiteLabelCobrado = o.incluirWhiteLabel && !o.whiteLabelBonificado ? o.valorWhiteLabel : 0;
  const implantacaoValor = o.incluirImplantacao ? o.valorImplantacao : 0;
  const implantacaoCobrada = o.incluirImplantacao && !o.implantacaoBonificada ? o.valorImplantacao : 0;

  const recorrenteMensal = mensalidade + whiteLabelCobrado;
  const vigenciaMeses = Math.max(1, Math.round(o.vigenciaMeses || 1));
  const totalVigencia = recorrenteMensal * vigenciaMeses + implantacaoCobrada;
  const primeiroPagamento = recorrenteMensal + implantacaoCobrada;

  // quanto o prazo economiza por mês em relação ao mensal sem compromisso
  const economiaMensalPeloPrazo = o.ciclo === 'prazo' ? (tabelaOutroCiclo - tabela) * usuarios : 0;

  const bonificadoTotal =
    (o.incluirImplantacao && o.implantacaoBonificada ? o.valorImplantacao : 0) +
    (o.incluirWhiteLabel && o.whiteLabelBonificado ? o.valorWhiteLabel * vigenciaMeses : 0);

  return {
    usuarios,
    faixa,
    ciclo: o.ciclo,
    tabela,
    tabelaOutroCiclo,
    cheio,
    porUsuario,
    descontoPercentual,
    mensalidadeCheia,
    mensalidade,
    descontoMensal,
    whiteLabelValor,
    whiteLabelCobrado,
    whiteLabelBonificado: o.incluirWhiteLabel && o.whiteLabelBonificado,
    implantacaoValor,
    implantacaoCobrada,
    implantacaoBonificada: o.incluirImplantacao && o.implantacaoBonificada,
    recorrenteMensal,
    vigenciaMeses,
    totalVigencia,
    primeiroPagamento,
    economiaMensalPeloPrazo,
    economiaPeriodoPeloPrazo: economiaMensalPeloPrazo * vigenciaMeses,
    bonificadoTotal,
  };
}

export const brl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
