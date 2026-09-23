import { faixaDe, FAIXAS, brl, MESES_MINIMOS_PRAZO, type Calculo } from '../lib/preco';
import type { Proposta } from '../lib/tipos';
import { Area, Chave, Grupo, Numero, Texto } from './campos';

export default function Formulario({
  proposta,
  calculo,
  aoMudar,
}: {
  proposta: Proposta;
  calculo: Calculo;
  aoMudar: (p: Proposta) => void;
}) {
  const mudarCliente = (campo: keyof Proposta['cliente'], valor: string) =>
    aoMudar({ ...proposta, cliente: { ...proposta.cliente, [campo]: valor } });
  const mudarPlano = (campo: keyof Proposta['plano'], valor: unknown) =>
    aoMudar({ ...proposta, plano: { ...proposta.plano, [campo]: valor } as Proposta['plano'] });
  const mudarCondicao = (campo: keyof Proposta['condicoes'], valor: unknown) =>
    aoMudar({ ...proposta, condicoes: { ...proposta.condicoes, [campo]: valor } as Proposta['condicoes'] });
  const mudarResponsavel = (campo: keyof Proposta['responsavel'], valor: string) =>
    aoMudar({ ...proposta, responsavel: { ...proposta.responsavel, [campo]: valor } });

  const faixa = faixaDe(proposta.plano.usuarios);

  return (
    <div className="flex flex-col gap-4">
      <Grupo titulo="Cliente">
        <Texto rotulo="Razão social" valor={proposta.cliente.razaoSocial} aoMudar={(v) => mudarCliente('razaoSocial', v)} dica="Empresa Exemplo Ltda" />
        <Texto rotulo="Nome fantasia" valor={proposta.cliente.nomeFantasia} aoMudar={(v) => mudarCliente('nomeFantasia', v)} largura="meia" dica="como o cliente é chamado" />
        <Texto rotulo="CNPJ" valor={proposta.cliente.cnpj} aoMudar={(v) => mudarCliente('cnpj', v)} largura="meia" dica="00.000.000/0001-00" />
        <Texto rotulo="Endereço" valor={proposta.cliente.endereco} aoMudar={(v) => mudarCliente('endereco', v)} dica="rua, número, cidade e estado" />
        <Texto rotulo="Contato" valor={proposta.cliente.contatoNome} aoMudar={(v) => mudarCliente('contatoNome', v)} largura="meia" />
        <Texto rotulo="Cargo" valor={proposta.cliente.contatoCargo} aoMudar={(v) => mudarCliente('contatoCargo', v)} largura="meia" />
        <Texto rotulo="E-mail" valor={proposta.cliente.contatoEmail} aoMudar={(v) => mudarCliente('contatoEmail', v)} largura="meia" tipo="email" />
        <Texto rotulo="Telefone" valor={proposta.cliente.contatoTelefone} aoMudar={(v) => mudarCliente('contatoTelefone', v)} largura="meia" tipo="tel" />
      </Grupo>

      <Grupo titulo="Plano">
        <div className="sm:col-span-2">
          <label className="rotulo-campo" htmlFor="usuarios">
            Número de usuários ativos
          </label>
          <div className="flex items-center gap-4">
            <input
              id="usuarios"
              type="range"
              min={1}
              max={60}
              value={Math.min(60, proposta.plano.usuarios)}
              onChange={(e) => mudarPlano('usuarios', Number(e.target.value))}
              className="h-[26px] flex-1 accent-[#6A5CFF]"
            />
            <input
              type="number"
              min={1}
              value={proposta.plano.usuarios}
              onChange={(e) => mudarPlano('usuarios', Number(e.target.value))}
              className="campo w-[92px] text-center"
            />
          </div>
          <p className="mt-2 text-[13px] text-txt-2">
            Faixa {faixa.rotulo} · {brl(faixa.prazo)} com prazo · {brl(faixa.mensal)} no mensal
          </p>
        </div>

        <div className="sm:col-span-2">
          <span className="rotulo-campo">Como o cliente vai contratar</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {([
              ['prazo', `Com prazo de ${proposta.plano.vigenciaMeses} meses`, faixa.prazo, `a partir de ${MESES_MINIMOS_PRAZO} meses`],
              ['mensal', 'Mensal', faixa.mensal, 'sem compromisso de permanência'],
            ] as const).map(([chave, titulo, preco, detalhe]) => {
              const ativo = proposta.plano.ciclo === chave;
              return (
                <button
                  key={chave}
                  type="button"
                  onClick={() => {
                    const ajustes: Partial<Proposta['plano']> = { ciclo: chave };
                    if (chave === 'prazo' && proposta.plano.vigenciaMeses < MESES_MINIMOS_PRAZO) {
                      ajustes.vigenciaMeses = MESES_MINIMOS_PRAZO;
                    }
                    aoMudar({ ...proposta, plano: { ...proposta.plano, ...ajustes } });
                  }}
                  className="rounded-[12px] px-4 py-3 text-left transition-colors"
                  style={{
                    background: ativo ? 'var(--color-ink)' : 'var(--color-paper)',
                    color: ativo ? '#fff' : 'var(--color-txt-2)',
                  }}
                >
                  <span className="block text-[14px] font-bold">{titulo}</span>
                  <span className="mt-1 block font-display text-[19px] font-extrabold" style={{ color: ativo ? 'var(--color-lime)' : 'var(--color-ink)' }}>
                    {brl(preco)}
                  </span>
                  <span className="block text-[12px] opacity-70">por usuário ao mês · {detalhe}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Numero
          rotulo={proposta.plano.ciclo === 'prazo' ? 'Prazo contratado' : 'Vigência do contrato'}
          valor={proposta.plano.vigenciaMeses}
          aoMudar={(v) => mudarPlano('vigenciaMeses', v)}
          min={proposta.plano.ciclo === 'prazo' ? MESES_MINIMOS_PRAZO : 1}
          max={60}
          sufixo="meses"
        />
        <Numero rotulo="Desconto comercial" valor={proposta.plano.descontoPercentual} aoMudar={(v) => mudarPlano('descontoPercentual', v)} min={0} max={100} passo={0.5} sufixo="%" />
        <Texto rotulo="Motivo do desconto (uso interno, não sai no PDF)" valor={proposta.plano.motivoDesconto} aoMudar={(v) => mudarPlano('motivoDesconto', v)} />

        <Chave
          rotulo="Preço por usuário definido na mão"
          ativo={proposta.plano.precoManual}
          aoMudar={(v) =>
            aoMudar({
              ...proposta,
              plano: {
                ...proposta.plano,
                precoManual: v,
                precoPorUsuario: v ? (proposta.plano.precoPorUsuario ?? calculo.tabela) : proposta.plano.precoPorUsuario,
              },
            })
          }
          detalhe={`Sem isso vale a tabela: ${FAIXAS.map((f) => `${f.rotulo} ${brl(f.prazo)} / ${brl(f.mensal)}`).join(' · ')}`}
        />
        {proposta.plano.precoManual && (
          <Numero
            rotulo="Preço cheio por usuário"
            valor={proposta.plano.precoPorUsuario ?? calculo.tabela}
            aoMudar={(v) => mudarPlano('precoPorUsuario', v)}
            min={0}
            passo={1}
            sufixo="por mês"
          />
        )}

        <Chave
          rotulo="Cobrar implantação, migração e treinamento"
          ativo={proposta.plano.incluirImplantacao}
          aoMudar={(v) => mudarPlano('incluirImplantacao', v)}
          detalhe="Valor cobrado uma única vez, junto do primeiro pagamento"
        />
        {proposta.plano.incluirImplantacao && (
          <>
            <Numero rotulo="Valor da implantação" valor={proposta.plano.valorImplantacao} aoMudar={(v) => mudarPlano('valorImplantacao', v)} min={0} passo={100} sufixo="uma vez" />
            <Chave
              rotulo="Implantação bonificada"
              ativo={proposta.plano.implantacaoBonificada}
              aoMudar={(v) => mudarPlano('implantacaoBonificada', v)}
              detalhe="O valor aparece na proposta com o selo de bonificado, e não entra na soma"
            />
          </>
        )}

        <Chave
          rotulo="Incluir marca própria (white-label)"
          ativo={proposta.plano.incluirWhiteLabel}
          aoMudar={(v) => mudarPlano('incluirWhiteLabel', v)}
          detalhe="A plataforma com a marca, as cores e o domínio do cliente"
        />
        {proposta.plano.incluirWhiteLabel && (
          <>
            <Numero rotulo="Valor do white-label" valor={proposta.plano.valorWhiteLabel} aoMudar={(v) => mudarPlano('valorWhiteLabel', v)} min={0} passo={10} sufixo="por mês" />
            <Chave
              rotulo="Marca própria bonificada"
              ativo={proposta.plano.whiteLabelBonificado}
              aoMudar={(v) => mudarPlano('whiteLabelBonificado', v)}
              detalhe="Aparece na proposta como bonificado, sem entrar na mensalidade"
            />
          </>
        )}
      </Grupo>

      <Grupo titulo="Condições e documento">
        <Numero rotulo="Validade da proposta" valor={proposta.condicoes.validadeDias} aoMudar={(v) => mudarCondicao('validadeDias', v)} min={1} max={90} sufixo="dias" />
        <Numero rotulo="Dia de vencimento" valor={proposta.condicoes.diaVencimento} aoMudar={(v) => mudarCondicao('diaVencimento', v)} min={1} max={28} sufixo="de cada mês" />
        <Texto rotulo="Forma de pagamento" valor={proposta.condicoes.formaPagamento} aoMudar={(v) => mudarCondicao('formaPagamento', v)} />
        <Area rotulo="Observações que saem no PDF" valor={proposta.condicoes.observacoes} aoMudar={(v) => mudarCondicao('observacoes', v)} />
        <Chave
          rotulo="Anexar o contrato de licença de uso ao PDF"
          ativo={proposta.incluirContrato}
          aoMudar={(v) => aoMudar({ ...proposta, incluirContrato: v })}
          detalhe="Sai depois da proposta, já preenchido com os dados do cliente e os valores desta negociação"
        />
      </Grupo>

      <Grupo titulo="Quem assina pela 75 LAB">
        <Texto rotulo="Nome" valor={proposta.responsavel.nome} aoMudar={(v) => mudarResponsavel('nome', v)} largura="meia" />
        <Texto rotulo="Cargo" valor={proposta.responsavel.cargo} aoMudar={(v) => mudarResponsavel('cargo', v)} largura="meia" />
        <Texto rotulo="E-mail" valor={proposta.responsavel.email} aoMudar={(v) => mudarResponsavel('email', v)} largura="meia" tipo="email" />
        <Texto rotulo="Telefone" valor={proposta.responsavel.telefone} aoMudar={(v) => mudarResponsavel('telefone', v)} largura="meia" tipo="tel" />
      </Grupo>
    </div>
  );
}
