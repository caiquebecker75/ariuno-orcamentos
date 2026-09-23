/** Tabela progressiva por usuário ativo, a mesma publicada no site do Ariuno. */
export const FAIXAS = [
  { de: 5, ate: 9, preco: 119, rotulo: '5 a 9 usuários' },
  { de: 10, ate: 19, preco: 99, rotulo: '10 a 19 usuários' },
  { de: 20, ate: 39, preco: 87, rotulo: '20 a 39 usuários' },
  { de: 40, ate: 79, preco: 75, rotulo: '40 a 79 usuários' },
  { de: 80, ate: 149, preco: 64, rotulo: '80 a 149 usuários' },
  { de: 150, ate: 99999, preco: 54, rotulo: '150 usuários ou mais' },
] as const;

export const MINIMO_USUARIOS = 5;
export const DESCONTO_ANUAL = 0.15;
export const IMPLANTACAO_PADRAO = 3900;
export const WHITE_LABEL_PADRAO = 690;
/** No plano anual, a implantação é isenta a partir desta quantidade de usuários. */
export const USUARIOS_ISENCAO_IMPLANTACAO = 20;

export type Ciclo = 'mensal' | 'anual';

export type Orcamento = {
  usuarios: number;
  ciclo: Ciclo;
  precoPorUsuario: number | null;
  precoManual: boolean;
  descontoPercentual: number;
  incluirImplantacao: boolean;
  valorImplantacao: number;
  incluirWhiteLabel: boolean;
  valorWhiteLabel: number;
  vigenciaMeses: number;
};

export function faixaDe(usuarios: number) {
  const n = Math.max(MINIMO_USUARIOS, usuarios);
  return FAIXAS.find((f) => n >= f.de && n <= f.ate) ?? FAIXAS[FAIXAS.length - 1];
}

export type Calculo = ReturnType<typeof calcular>;

export function calcular(o: Orcamento) {
  const usuarios = Math.max(MINIMO_USUARIOS, Math.round(o.usuarios || 0));
  const faixa = faixaDe(usuarios);
  const tabela = faixa.preco;
  const cheio = o.precoManual && o.precoPorUsuario !== null ? o.precoPorUsuario : tabela;

  const descontoPercentual = Math.min(100, Math.max(0, o.descontoPercentual || 0));
  const porUsuario = cheio * (1 - descontoPercentual / 100);

  const mensalidadeCheia = cheio * usuarios;
  const mensalidade = porUsuario * usuarios;
  const descontoMensal = mensalidadeCheia - mensalidade;

  const whiteLabel = o.incluirWhiteLabel ? o.valorWhiteLabel : 0;
  const recorrenteMensal = mensalidade + whiteLabel;

  const anualSemDesconto = recorrenteMensal * 12;
  const anualAVista = anualSemDesconto * (1 - DESCONTO_ANUAL);
  const economiaAnual = anualSemDesconto - anualAVista;

  const isentaImplantacao = o.ciclo === 'anual' && usuarios >= USUARIOS_ISENCAO_IMPLANTACAO;
  const implantacao = o.incluirImplantacao && !isentaImplantacao ? o.valorImplantacao : 0;

  const primeiroPagamento = o.ciclo === 'anual' ? anualAVista + implantacao : recorrenteMensal + implantacao;
  const totalVigencia =
    o.ciclo === 'anual'
      ? anualAVista * (o.vigenciaMeses / 12) + implantacao
      : recorrenteMensal * o.vigenciaMeses + implantacao;

  return {
    usuarios,
    faixa,
    tabela,
    cheio,
    porUsuario,
    descontoPercentual,
    mensalidadeCheia,
    mensalidade,
    descontoMensal,
    whiteLabel,
    recorrenteMensal,
    anualSemDesconto,
    anualAVista,
    economiaAnual,
    isentaImplantacao,
    implantacao,
    primeiroPagamento,
    totalVigencia,
  };
}

export const brl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

export const brlCurto = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
