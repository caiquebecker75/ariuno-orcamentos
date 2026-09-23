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

  const textoImplantacao = c.isentaImplantacao
    ? 'Por se tratar de plano anual com 20 usuários ou mais, a implantação é isenta.'
    : c.implantacao > 0
      ? `O valor de ${brl(c.implantacao)} é devido uma única vez, no primeiro pagamento.`
      : 'A implantação não foi incluída nesta contratação.';

  const textoWhiteLabel = plano.incluirWhiteLabel
    ? `Ao valor por usuário soma-se ${brl(c.whiteLabel)} por mês referente ao módulo de marca própria.`
    : '';

  const textoCiclo =
    plano.ciclo === 'anual'
      ? `O pagamento é anual e antecipado, no valor de ${brl(c.anualAVista)}, já considerado o desconto de 15% para pagamento à vista, com vencimento no dia ${condicoes.diaVencimento} e renovação a cada 12 meses.`
      : `O pagamento é mensal, no valor de ${brl(c.recorrenteMensal)}, com vencimento todo dia ${condicoes.diaVencimento} de cada mês, por ${condicoes.formaPagamento.toLowerCase()}.`;

  return {
    MARCA: empresa.marca,
    PLATAFORMA_URL: empresa.plataformaUrl,
    NUMERO: proposta.numero,
    DATA_EXTENSO: porExtenso(proposta.criadoEm),
    VIGENCIA_MESES: String(plano.vigenciaMeses),
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
    PRIMEIRO_PAGAMENTO: brl(c.primeiroPagamento),
    TEXTO_IMPLANTACAO: textoImplantacao,
    TEXTO_WHITE_LABEL_PRECO: textoWhiteLabel,
    TEXTO_CICLO_PAGAMENTO: textoCiclo,
  };
}

export function preencher(texto: string, mapa: Record<string, string>) {
  return texto.replace(/\{\{(\w+)\}\}/g, (_, chave: string) => mapa[chave] ?? `{{${chave}}}`).replace(/\s{2,}/g, ' ').trim();
}
