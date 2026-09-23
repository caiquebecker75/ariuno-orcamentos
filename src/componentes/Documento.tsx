import { clausulas, fechoContrato, preambulo } from '../conteudo/contrato';
import type { Empresa } from '../conteudo/empresa';
import { dataCurta, porExtenso, preencher, validadeEm, valores } from '../lib/documento';
import { brl, type Calculo } from '../lib/preco';
import type { Proposta } from '../lib/tipos';
import { Logotipo, Marca } from './Marca';
import { urlPublica } from '../lib/caminhos';

const INCLUSO = [
  'Todos os módulos, sem funcionalidade trancada em plano superior',
  'Usuários do tipo cliente ilimitados e sem custo, para acompanhar e aprovar',
  'Quadros, Gantt, calendário, horas, capacidade, aprovações e portal do cliente',
  'Relatório do cliente, financeiro com margem, Ariuno IA e Arena',
  'Novas funcionalidades e suporte em português durante toda a vigência',
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
  const comPrazo = plano.ciclo === 'prazo';
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

        <h1 style={{ fontSize: '17.5pt' }}>
          Licença de uso da plataforma Ariuno
          <br />
          para {cliente.nomeFantasia || cliente.razaoSocial || '[cliente]'}
        </h1>
        <p style={{ marginTop: '4pt', color: '#4d5472', maxWidth: '165mm', fontSize: '9pt' }}>
          A operação inteira num sistema só, do briefing à nota fiscal. Proposta para {calculo.usuarios} usuários
          ativos, {comPrazo ? `com prazo de ${calculo.vigenciaMeses} meses` : 'no plano mensal'}.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9pt', margin: '11pt 0' }}>
          <div style={{ background: '#f7f8fd', borderRadius: '8pt', padding: '7pt 9pt' }}>
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
          <div style={{ background: '#0b0d1e', color: '#fff', borderRadius: '8pt', padding: '7pt 9pt' }}>
            <p className="mono" style={{ margin: 0, fontSize: '7.5pt', letterSpacing: '0.1em', color: 'rgb(255 255 255 / 0.55)' }}>
              INVESTIMENTO MENSAL
            </p>
            <p style={{ margin: '4pt 0 0', fontFamily: 'Archivo, sans-serif', fontSize: '22pt', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {brl(calculo.recorrenteMensal)}
            </p>
            <p style={{ margin: '2pt 0 0', fontSize: '9pt', color: 'rgb(255 255 255 / 0.7)' }}>
              {brl(calculo.porUsuario)} por usuário ao mês · {calculo.usuarios} usuários
            </p>
            <p style={{ margin: '3pt 0 0', fontSize: '8.5pt', color: 'rgb(255 255 255 / 0.7)' }}>
              {comPrazo ? `contrato de ${calculo.vigenciaMeses} meses` : 'mensal, sem compromisso de permanência'}
            </p>
            {comPrazo && calculo.economiaMensalPeloPrazo > 0 && (
              <p style={{ margin: '4pt 0 0', fontSize: '9pt', color: '#c0ee4e' }}>
                economia de {brl(calculo.economiaPeriodoPeloPrazo)} no período, contra o mensal
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
                <td>
                  Sua marca e seu domínio na plataforma
                </td>
                <td style={{ textAlign: 'right' }}>
                  {calculo.whiteLabelBonificado ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: '#8a90ac' }}>{brl(calculo.whiteLabelValor)}</span>{' '}
                      <strong style={{ color: '#4b3be0' }}>bonificado</strong>
                    </>
                  ) : (
                    `${brl(calculo.whiteLabelValor)} / mês`
                  )}
                </td>
              </tr>
            )}
            <tr>
              <td>Implantação, migração e treinamento</td>
              <td>
                Descoberta, configuração, migração, treinamento e go-live em 21 dias
              </td>
              <td style={{ textAlign: 'right' }}>
                {calculo.implantacaoBonificada ? (
                  <>
                    <span style={{ textDecoration: 'line-through', color: '#8a90ac' }}>{brl(calculo.implantacaoValor)}</span>{' '}
                    <strong style={{ color: '#4b3be0' }}>bonificada</strong>
                  </>
                ) : calculo.implantacaoCobrada > 0 ? (
                  `${brl(calculo.implantacaoCobrada)} uma vez`
                ) : (
                  'não incluída'
                )}
              </td>
            </tr>
            <tr className="doc-total">
              <td>Total do primeiro pagamento (1ª mensalidade{calculo.implantacaoCobrada > 0 ? ' + implantação' : ''})</td>
              <td>
                recorrência de {brl(calculo.recorrenteMensal)} por mês
                {comPrazo && ` · total de ${brl(calculo.totalVigencia)} no contrato de ${calculo.vigenciaMeses} meses`}
              </td>
              <td style={{ textAlign: 'right' }}>{brl(calculo.primeiroPagamento)}</td>
            </tr>
          </tbody>
        </table>

        <div className="bloco-fecho" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '12pt', marginTop: '11pt' }}>
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
            <div style={{ display: 'grid', gap: '5pt' }}>
              <Campo
                rotulo="Contratação"
                valor={comPrazo ? `${calculo.vigenciaMeses} meses de permanência` : 'Mensal, sem compromisso de permanência'}
              />
              <Campo rotulo="Pagamento" valor={`Mensal · ${condicoes.formaPagamento} · dia ${condicoes.diaVencimento}`} />
              <Campo rotulo="Reajuste" valor="IPCA a cada 6 meses de vigência" />
              <Campo rotulo="Liberação" valor="Acessos liberados após a confirmação do primeiro pagamento" />
              {comPrazo && (
                <Campo rotulo="Encerramento antes do prazo" valor="Multa de 30% sobre as mensalidades faltantes" />
              )}
              <Campo rotulo="Validade desta proposta" valor={`${condicoes.validadeDias} dias, até ${validadeEm(proposta.criadoEm, condicoes.validadeDias)}`} />
            </div>
          </div>
        </div>

        {condicoes.observacoes.trim() && (
          <div className="bloco-fecho" style={{ marginTop: '10pt', background: '#f7f8fd', borderRadius: '8pt', padding: '7pt 9pt' }}>
            <p className="mono" style={{ margin: 0, fontSize: '7.5pt', letterSpacing: '0.1em', color: '#696f8d' }}>
              OBSERVAÇÕES
            </p>
            <p style={{ margin: '4pt 0 0', fontSize: '9.5pt', whiteSpace: 'pre-line' }}>{condicoes.observacoes}</p>
          </div>
        )}

        <div className="bloco-fecho" style={{ marginTop: '9pt', display: 'flex', alignItems: 'center', gap: '8pt', background: '#eaedf9', borderRadius: '8pt', padding: '7pt 10pt' }}>
          <Marca tamanho={22} />
          <p style={{ margin: 0, fontSize: '8.5pt', color: '#3d4360' }}>
            Para aceitar, responda este documento assinado. O contrato nas páginas seguintes passa a valer com a
            assinatura das duas partes, e os acessos são liberados após a confirmação do primeiro pagamento.
            {calculo.bonificadoTotal > 0 && (
              <>
                {' '}
                <strong style={{ color: '#4b3be0' }}>
                  Bonificação nesta proposta: {brl(calculo.bonificadoTotal)}.
                </strong>
              </>
            )}
            <br />
            <strong style={{ color: '#14172b' }}>
              {responsavel.nome || empresa.nomeFantasia}
              {responsavel.cargo ? `, ${responsavel.cargo}` : ''}
            </strong>{' '}
            · {responsavel.email || empresa.email}
            {responsavel.telefone ? ` · ${responsavel.telefone}` : ''}
          </p>
        </div>


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

      {proposta.incluirAnexoCnpj && (
        <Folha quebraAntes rodape={<Rodape proposta={proposta} empresa={empresa} />}>
          <h1 style={{ fontSize: '16pt' }}>Anexo I · Cartão CNPJ da contratada</h1>
          <p style={{ marginTop: '4pt', fontSize: '9pt', color: '#696f8d' }}>
            Comprovante de inscrição e de situação cadastral de {empresa.razaoSocial}, parte integrante do contrato
            de licença de uso · proposta {proposta.numero}
          </p>
          <img
            src={urlPublica('anexos/cartao-cnpj-75lab.png')}
            alt="Cartão CNPJ da 75 LAB"
            style={{
              display: 'block',
              width: 'auto',
              maxWidth: '100%',
              maxHeight: '222mm',
              margin: '9pt auto 0',
              borderRadius: '4pt',
            }}
          />
        </Folha>
      )}

    </div>
  );
}
