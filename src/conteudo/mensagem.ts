import type { Empresa } from './empresa';
import { validadeEm } from '../lib/documento';
import { brl, type Calculo } from '../lib/preco';
import type { Proposta } from '../lib/tipos';

/**
 * Texto padrão que o executivo manda junto com a proposta.
 * Agradece a reunião, apresenta as duas formas de contratar e diz o que
 * acontece depois do aceite. Os trechos entre colchetes são para personalizar.
 */
export function montarMensagem(
  proposta: Proposta,
  empresa: Empresa,
  mensal: Calculo,
  anual: Calculo,
) {
  const { cliente, condicoes, responsavel } = proposta;
  const nome = (cliente.contatoNome || '').trim().split(' ')[0] || '[nome]';
  const empresaCliente = cliente.nomeFantasia || cliente.razaoSocial || '[empresa]';
  const usuarios = anual.usuarios;
  const validade = validadeEm(proposta.criadoEm, condicoes.validadeDias);
  const quemAssina = responsavel.nome.trim() || '[seu nome]';

  const assunto = `Proposta do Ariuno para ${empresaCliente} · ${proposta.numero}`;

  const corpo = [
    `Olá, ${nome}, tudo bem?`,
    '',
    `Obrigado pelo tempo de hoje. Saí da conversa com uma ideia clara do que trava a operação de vocês hoje: [resuma em uma linha o que ele contou, com as palavras dele].`,
    '',
    `Montei a proposta do Ariuno para os ${usuarios} usuários que combinamos, nas duas formas de contratar, para você comparar com calma:`,
    '',
    `1. Contrato de ${anual.vigenciaMeses} meses: ${brl(anual.recorrenteMensal)} por mês, ${brl(anual.porUsuario)} por usuário. Economia de ${brl(anual.economiaPeriodoPeloPrazo)} no período.`,
    `2. Mensal, sem compromisso de permanência: ${brl(mensal.recorrenteMensal)} por mês, ${brl(mensal.porUsuario)} por usuário.`,
    '',
    'Nos dois casos entra a plataforma inteira: quadros, Gantt, calendário, apontamento de horas, capacidade do time, aprovações, portal e relatório do cliente, financeiro com margem e a Ariuno IA. Usuários do tipo cliente são ilimitados e não ocupam assento, então seus clientes acompanham e aprovam sem custo.',
    '',
    `${anual.implantacaoBonificada || mensal.implantacaoBonificada ? `A implantação, de ${brl(anual.implantacaoValor)}, está bonificada nesta proposta.` : `A implantação, migração das bases e treinamento do time entram uma única vez, por ${brl(anual.implantacaoValor)}.`}`,
    '',
    'Como funciona depois do aceite:',
    '',
    'Você responde este e-mail com o documento assinado.',
    'Confirmado o primeiro pagamento, liberamos os acessos e começamos a implantação.',
    'Em até 21 dias o time está rodando dentro da plataforma, e acompanhamos o primeiro fechamento de mês com vocês.',
    '',
    `O contrato completo vai junto no PDF, com o cartão CNPJ da ${empresa.nomeFantasia} em anexo. A proposta vale até ${validade}.`,
    '',
    'Se quiser, marco 30 minutos para passar pelos números com o seu time antes de decidir. É só me dizer o melhor dia.',
    '',
    'Abraço,',
    `${quemAssina}${responsavel.cargo ? `, ${responsavel.cargo}` : ''}`,
    `${empresa.nomeFantasia} · ${responsavel.email || empresa.email}${responsavel.telefone ? ` · ${responsavel.telefone}` : ''}`,
  ].join('\n');

  const whatsapp = [
    `Oi, ${nome}, tudo bem? Aqui é ${quemAssina}, da ${empresa.nomeFantasia}.`,
    '',
    `Obrigado pela conversa de hoje. Acabei de te mandar por e-mail a proposta do Ariuno para os ${usuarios} usuários, nas duas formas:`,
    '',
    `Contrato de ${anual.vigenciaMeses} meses: ${brl(anual.recorrenteMensal)} por mês`,
    `Mensal, sem fidelidade: ${brl(mensal.recorrenteMensal)} por mês`,
    '',
    `O contrato completo está no PDF. Vale até ${validade}. Qualquer dúvida me chama por aqui.`,
  ].join('\n');

  return { assunto, corpo, whatsapp };
}
