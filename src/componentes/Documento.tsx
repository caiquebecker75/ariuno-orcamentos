import { clausulas, fechoContrato, preambulo } from '../conteudo/contrato';
import type { Empresa } from '../conteudo/empresa';
import { dataCurta, porExtenso, preencher, validadeEm, valores } from '../lib/documento';
import { brl, type Calculo } from '../lib/preco';
import type { Proposta } from '../lib/tipos';
import { Logotipo, Marca } from './Marca';

const INCLUSO = [
  'Todos os módulos, sem funcionalidade trancada em plano superior',
  'Usuários do tipo cliente ilimitados e sem custo, para acompanhar e aprovar',
  'Quadros, Gantt, calendário, apontamento de horas e capacidade do time',
  'Aprovações com histórico, formulários públicos e portal do cliente',
  'Relatório do cliente em link público e em PDF',
  'Financeiro com orçamento, despesa por tarefa, contas e margem por cliente',
  'Ariuno IA, Arena de adoção e novas funcionalidades durante a vigência',
  'Suporte em português, em dias úteis, com quem construiu a plataforma',
];


/** Cada folha é uma tabela com rodapé: é assim que o Chrome repete o rodapé em toda página do PDF. */
function Folha({
  children,
  quebraAntes = false,
  rodape,
}: {
  children: React.ReactNode;
  quebraAntes?: boolean;
  rodape: React.ReactNode;
}) {
  return (
    <table className={`folha ${quebraAntes ? 'quebra-antes' : ''}`}>
      <tfoot>
        <tr>
          <td>
            <div className="rodape-doc">{rodape}</div>
          </td>
        </tr>
      </tfoot>
      <tbody>
        <tr>
          <td>
            <div className="documento">{children}</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}


function Rodape({ proposta, empresa }: { proposta: Proposta; empresa: Empresa }) {
  const cliente = proposta.cliente.razaoSocial || proposta.cliente.nomeFantasia || 'cliente';
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5pt' }}>
        <Marca tamanho={13} />
        <strong style={{ fontSize: '8pt', color: '#14172b' }}>ariuno</strong>
        <span>· {empresa.nomeFantasia}</span>
      </span>
      <span>
        {proposta.numero} · {cliente} · {dataCurta(proposta.criadoEm)}
      </span>
      <span>{empresa.plataformaUrl}</span>
    </>
  );
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: '7.5pt', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a90ac' }}>
        {rotulo}
      </p>
      <p style={{ margin: '2pt 0 0', fontSize: '10pt', fontWeight: 500 }}>{valor || '[preencher]'}</p>
    </div>
  );
}

export default function Documento({
  proposta,
  empresa,
  calculo,
}: {
  proposta: Proposta;
  empresa: Empresa;
  calculo: Calculo;
}) {
  const { cliente, plano, condicoes, responsavel } = proposta;
  const mapa = valores(proposta, empresa, calculo);
  const anual = plano.ciclo === 'anual';
  const clausulasAtivas = clausulas.filter((c) => (c.quando === 'whiteLabel' ? plano.incluirWhiteLabel : true));

  return (
    <div className="palco-documento">
      {/* ─────────── página 1: proposta ─────────── */}
      <Folha rodape={<Rodape proposta={proposta} empresa={empresa} />}>
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12pt' }}>
          <Logotipo tamanho={30} />
          <div style={{ textAlign: 'right' }}>
            <p className="mono" style={{ margin: 0, fontSize: '8pt', letterSpacing: '0.1em', color: '#696f8d' }}>
              PROPOSTA COMERCIAL
            </p>
            <p className="mono" style={{ margin: '2pt 0 0', fontSize: '11pt', fontWeight: 700 }}>{proposta.numero}</p>
            <p style={{ margin: '2pt 0 0', fontSize: '8.5pt', color: '#696f8d' }}>
              {dataCurta(proposta.criadoEm)} · válida até {validadeEm(proposta.criadoEm, condicoes.validadeDias)}
            </p>
          </div>
        </header>

        <div style={{ height: '3pt', margin: '9pt 0 11pt', background: 'linear-gradient(90deg,#6A5CFF,#4285FF 50%,#00C2A8)', borderRadius: '2pt' }} />

        <h1 style={{ fontSize: '19pt' }}>
          Licença de uso da plataforma Ariuno
          <br />
          para {cliente.nomeFantasia || cliente.razaoSocial || '[cliente]'}
        </h1>
        <p style={{ marginTop: '5pt', color: '#4d5472', maxWidth: '150mm', fontSize: '9.5pt' }}>
          A operação inteira num sistema só, do briefing à nota fiscal: quadros, prazos, horas, aprovação do
          cliente, relatórios e financeiro. Esta proposta considera {calculo.usuarios} usuários ativos e vigência de{' '}
          {plano.vigenciaMeses} meses.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9pt', margin: '11pt 0' }}>
          <div style={{ background: '#f7f8fd', borderRadius: '8pt', padding: '10pt 12pt' }}>
            <p className="mono" style={{ margin: 0, fontSize: '7.5pt', letterSpacing: '0.1em', color: '#696f8d' }}>
              PREPARADA PARA
            </p>
            <p style={{ margin: '4pt 0 0', fontSize: '11pt', fontWeight: 700 }}>
              {cliente.razaoSocial || '[razão social do cliente]'}
            </p>
            <p style={{ margin: '2pt 0 0', fontSize: '9pt', color: '#4d5472' }}>
              {cliente.cnpj ? `CNPJ ${cliente.cnpj}` : '[CNPJ]'}
              {cliente.endereco ? ` · ${cliente.endereco}` : ''}
            </p>
            <p style={{ margin: '5pt 0 0', fontSize: '9pt', color: '#4d5472' }}>
              {cliente.contatoNome || '[contato]'}
              {cliente.contatoCargo ? `, ${cliente.contatoCargo}` : ''}
              <br />
              {cliente.contatoEmail} {cliente.contatoTelefone ? `· ${cliente.contatoTelefone}` : ''}
            </p>
          </div>
          <div style={{ background: '#0b0d1e', color: '#fff', borderRadius: '8pt', padding: '10pt 12pt' }}>
            <p className="mono" style={{ margin: 0, fontSize: '7.5pt', letterSpacing: '0.1em', color: 'rgb(255 255 255 / 0.55)' }}>
              INVESTIMENTO {anual ? 'ANUAL À VISTA' : 'MENSAL'}
            </p>
            <p style={{ margin: '4pt 0 0', fontFamily: 'Archivo, sans-serif', fontSize: '24pt', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {brl(anual ? calculo.anualAVista : calculo.recorrenteMensal)}
            </p>
            <p style={{ margin: '2pt 0 0', fontSize: '9pt', color: 'rgb(255 255 255 / 0.7)' }}>
              {brl(calculo.porUsuario)} por usuário ao mês · {calculo.usuarios} usuários
            </p>
            {anual && (
              <p style={{ margin: '5pt 0 0', fontSize: '9pt', color: '#c0ee4e' }}>
                economia de {brl(calculo.economiaAnual)} no ano
              </p>
            )}
            {calculo.descontoPercentual > 0 && (
              <p style={{ margin: '3pt 0 0', fontSize: '9pt', color: '#c0ee4e' }}>
                desconto comercial de {calculo.descontoPercentual}% já aplicado
              </p>
            )}
          </div>
        </div>

        <h2>Composição do investimento</h2>
        <table className="doc-tabela">
          <thead>
            <tr>
              <th>Item</th>
              <th>Detalhe</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Licença de uso por usuário ativo</td>
              <td>
                Faixa {calculo.faixa.rotulo} · {calculo.usuarios} usuários
                {calculo.descontoPercentual > 0 && (
                  <>
                    <br />
                    <span style={{ color: '#696f8d' }}>
                      de {brl(calculo.cheio)} por {brl(calculo.porUsuario)} por usuário
                    </span>
                  </>
                )}
              </td>
              <td style={{ textAlign: 'right' }}>{brl(calculo.mensalidade)} / mês</td>
            </tr>
            {plano.incluirWhiteLabel && (
              <tr>
                <td>Marca própria (white-label)</td>
                <td>Sua marca, suas cores e seu domínio na plataforma</td>
                <td style={{ textAlign: 'right' }}>{brl(calculo.whiteLabel)} / mês</td>
              </tr>
            )}
            <tr>
              <td>Implantação, migração e treinamento</td>
              <td>
                Descoberta, configuração, migração das bases, treinamento por função e go-live em 21 dias
                {calculo.isentaImplantacao && (
                  <>
                    <br />
                    <span style={{ color: '#0e8a6a' }}>isenta no plano anual a partir de 20 usuários</span>
                  </>
                )}
              </td>
              <td style={{ textAlign: 'right' }}>
                {calculo.implantacao > 0 ? `${brl(calculo.implantacao)} uma vez` : 'isenta'}
              </td>
            </tr>
            <tr>
              <td>Usuários do tipo cliente</td>
              <td>Ilimitados, acompanham e aprovam sem ocupar assento</td>
              <td style={{ textAlign: 'right' }}>sem custo</td>
            </tr>
            <tr className="doc-total">
              <td>{anual ? 'Total do primeiro pagamento (anual à vista + implantação)' : 'Total do primeiro pagamento (1ª mensalidade + implantação)'}</td>
              <td>{anual ? 'renovação a cada 12 meses' : `recorrência de ${brl(calculo.recorrenteMensal)} por mês`}</td>
              <td style={{ textAlign: 'right' }}>{brl(calculo.primeiroPagamento)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '12pt', marginTop: '11pt' }}>
          <div>
            <h2>O que está incluído</h2>
            <ul style={{ margin: 0, paddingLeft: '12pt', fontSize: '9pt', color: '#3d4360' }}>
              {INCLUSO.map((item) => (
                <li key={item} style={{ marginBottom: '1.5pt' }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Condições</h2>
            <div style={{ display: 'grid', gap: '6pt' }}>
              <Campo rotulo="Vigência" valor={`${plano.vigenciaMeses} meses, sem fidelidade além do período`} />
              <Campo rotulo="Pagamento" valor={`${anual ? 'Anual à vista' : 'Mensal'} · ${condicoes.formaPagamento} · vencimento dia ${condicoes.diaVencimento}`} />
              <Campo rotulo="Reajuste" valor="IPCA a cada 12 meses de vigência" />
              <Campo rotulo="Validade desta proposta" valor={`${condicoes.validadeDias} dias, até ${validadeEm(proposta.criadoEm, condicoes.validadeDias)}`} />
              <Campo rotulo="Início" valor="Implantação começa em até 5 dias úteis do aceite" />
            </div>
          </div>
        </div>

        {condicoes.observacoes.trim() && (
          <div style={{ marginTop: '10pt', background: '#f7f8fd', borderRadius: '8pt', padding: '10pt 12pt' }}>
            <p className="mono" style={{ margin: 0, fontSize: '7.5pt', letterSpacing: '0.1em', color: '#696f8d' }}>
              OBSERVAÇÕES
            </p>
            <p style={{ margin: '4pt 0 0', fontSize: '9.5pt', whiteSpace: 'pre-line' }}>{condicoes.observacoes}</p>
          </div>
        )}

        <div style={{ marginTop: '11pt', display: 'flex', alignItems: 'center', gap: '9pt', background: '#eaedf9', borderRadius: '8pt', padding: '9pt 11pt' }}>
          <Marca tamanho={22} />
          <p style={{ margin: 0, fontSize: '9pt', color: '#3d4360' }}>
            Para aceitar, basta responder este documento assinado. O contrato de licença de uso, nas páginas
            seguintes, passa a valer com a assinatura das duas partes.
          </p>
        </div>

        <p style={{ marginTop: '8pt', fontSize: '8.5pt', color: '#4d5472' }}>
          {responsavel.nome || empresa.nomeFantasia}
          {responsavel.cargo ? `, ${responsavel.cargo}` : ''} · {responsavel.email || empresa.email}
          {responsavel.telefone ? ` · ${responsavel.telefone}` : ''}
        </p>
      </Folha>

      {/* ─────────── contrato ─────────── */}
      {proposta.incluirContrato && (
        <Folha quebraAntes rodape={<Rodape proposta={proposta} empresa={empresa} />}>
          <h1 style={{ fontSize: '16pt' }}>Contrato de licença de uso de software em modelo SaaS</h1>
          <p style={{ marginTop: '4pt', fontSize: '9pt', color: '#696f8d' }}>
            Plataforma {empresa.marca} · proposta {proposta.numero} · {porExtenso(proposta.criadoEm)}
          </p>

          <p style={{ marginTop: '10pt', textAlign: 'justify' }}>{preencher(preambulo, mapa)}</p>

          <div style={{ marginTop: '10pt' }}>
            {clausulasAtivas.map((clausula, i) => (
              <div className="clausula" key={clausula.titulo}>
                <h3>
                  Cláusula {i + 1}ª · {clausula.titulo}
                </h3>
                <ol>
                  {clausula.itens.map((item, j) => (
                    <li key={j}>
                      <span className="n">
                        {i + 1}.{j + 1}
                      </span>
                      {preencher(item, mapa)}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <p style={{ marginTop: '10pt', textAlign: 'justify' }}>{fechoContrato}</p>

          <p style={{ marginTop: '14pt', fontSize: '9.5pt' }}>
            {empresa.endereco && empresa.endereco.includes('PREENCHER') ? '' : `${empresa.endereco.split(',').slice(-2).join(',').trim()}, `}
            {porExtenso(proposta.criadoEm)}.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18pt', marginTop: '22pt' }}>
            <div>
              <div style={{ borderTop: '1px solid #14172b', paddingTop: '4pt' }}>
                <p style={{ margin: 0, fontSize: '9pt', fontWeight: 700 }}>{mapa.CONTRATADA_RAZAO}</p>
                <p style={{ margin: '1pt 0 0', fontSize: '8.5pt', color: '#4d5472' }}>
                  CONTRATADA · CNPJ {mapa.CONTRATADA_CNPJ}
                </p>
              </div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #14172b', paddingTop: '4pt' }}>
                <p style={{ margin: 0, fontSize: '9pt', fontWeight: 700 }}>{mapa.CLIENTE_RAZAO}</p>
                <p style={{ margin: '1pt 0 0', fontSize: '8.5pt', color: '#4d5472' }}>
                  CONTRATANTE · CNPJ {mapa.CLIENTE_CNPJ}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18pt', marginTop: '22pt' }}>
            {['Testemunha 1', 'Testemunha 2'].map((t) => (
              <div key={t} style={{ borderTop: '1px solid #9aa0bb', paddingTop: '4pt' }}>
                <p style={{ margin: 0, fontSize: '8.5pt', color: '#4d5472' }}>{t} · nome e CPF</p>
              </div>
            ))}
          </div>
        </Folha>
      )}

    </div>
  );
}
