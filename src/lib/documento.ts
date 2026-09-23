import type { Empresa } from '../conteudo/empresa';
import { brl, type Calculo } from './preco';
import type { Proposta } from './tipos';

const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

export function porExtenso(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function dataCurta(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function validadeEm(iso: string, dias: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + dias);
  return d.toLocaleDateString('pt-BR');
}

/** Vazio vira um marcador visível, para ninguém enviar proposta com buraco. */
const ou = (valor: string, marcador: string) => (valor.trim() ? valor.trim() : `[${marcador}]`);

export function valores(proposta: Proposta, empresa: Empresa, c: Calculo): Record<string, string> {
  const { plano, cliente, condicoes } = proposta;

  const textoImplantacao = c.implantacaoBonificada
    ? `O valor de ${brl(c.implantacaoValor)} está bonificado nesta proposta e não será cobrado.`
    : c.implantacaoCobrada > 0
      ? `O valor de ${brl(c.implantacaoCobrada)} é devido uma única vez, no primeiro pagamento.`
      : 'A implantação não foi incluída nesta contratação.';

  const textoWhiteLabel = !plano.incluirWhiteLabel
    ? ''
    : c.whiteLabelBonificado
      ? `O módulo de marca própria, de ${brl(c.whiteLabelValor)} por mês, está bonificado nesta proposta.`
      : `Ao valor por usuário soma-se ${brl(c.whiteLabelCobrado)} por mês referente ao módulo de marca própria.`;

  const textoCiclo =
    plano.ciclo === 'prazo'
      ? `O pagamento é mensal, no valor de ${brl(c.recorrenteMensal)}, com vencimento todo dia ${condicoes.diaVencimento} de cada mês, por ${condicoes.formaPagamento.toLowerCase()}. O valor por usuário considera o compromisso de permanência de ${c.vigenciaMeses} meses previsto na cláusula de prazo.`
      : `O pagamento é mensal, no valor de ${brl(c.recorrenteMensal)}, com vencimento todo dia ${condicoes.diaVencimento} de cada mês, por ${condicoes.formaPagamento.toLowerCase()}, sem compromisso de permanência.`;

  const textoFidelidade =
    plano.ciclo === 'prazo'
      ? `A CONTRATANTE compromete-se a manter a contratação pelo prazo de ${c.vigenciaMeses} meses, condição que sustenta o valor por usuário praticado nesta proposta. O encerramento antes desse prazo, por iniciativa da CONTRATANTE e sem justa causa, implica a cobrança da diferença entre o valor pago e o valor da tabela sem compromisso de permanência, aplicada aos meses já utilizados.`
      : 'Não há compromisso de permanência. A CONTRATANTE pode encerrar o contrato ao fim de qualquer mês, mediante o aviso prévio previsto nesta cláusula.';

  return {
    MARCA: empresa.marca,
    PLATAFORMA_URL: empresa.plataformaUrl,
    NUMERO: proposta.numero,
    DATA_EXTENSO: porExtenso(proposta.criadoEm),
    VIGENCIA_MESES: String(c.vigenciaMeses),
    FORO: ou(empresa.foro, 'PREENCHER: foro'),
    CONTRATADA_RAZAO: ou(empresa.razaoSocial, 'PREENCHER: razão social da contratada'),
    CONTRATADA_CNPJ: ou(empresa.cnpj, 'PREENCHER: CNPJ da contratada'),
    CONTRATADA_ENDERECO: ou(empresa.endereco, 'PREENCHER: endereço da contratada'),
    CLIENTE_RAZAO: ou(cliente.razaoSocial, 'razão social do cliente'),
    CLIENTE_CNPJ: ou(cliente.cnpj, 'CNPJ do cliente'),
    CLIENTE_ENDERECO: ou(cliente.endereco, 'endereço do cliente'),
    USUARIOS: String(c.usuarios),
    VALOR_POR_USUARIO: brl(c.porUsuario),
    VALOR_MENSAL: brl(c.mensalidade),
    VALOR_RECORRENTE: brl(c.recorrenteMensal),
    TOTAL_PERIODO: brl(c.totalVigencia),
    PRIMEIRO_PAGAMENTO: brl(c.primeiroPagamento),
    TEXTO_IMPLANTACAO: textoImplantacao,
    TEXTO_WHITE_LABEL_PRECO: textoWhiteLabel,
    TEXTO_CICLO_PAGAMENTO: textoCiclo,
    TEXTO_FIDELIDADE: textoFidelidade,
  };
}

export function preencher(texto: string, mapa: Record<string, string>) {
  return texto.replace(/\{\{(\w+)\}\}/g, (_, chave: string) => mapa[chave] ?? `{{${chave}}}`).replace(/\s{2,}/g, ' ').trim();
}
