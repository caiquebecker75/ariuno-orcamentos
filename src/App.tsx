import { useEffect, useMemo, useRef, useState } from 'react';
import Documento from './componentes/Documento';
import Formulario from './componentes/Formulario';
import { Botao, Grupo, Texto } from './componentes/campos';
import { Logotipo } from './componentes/Marca';
import { empresaPadrao, type Empresa } from './conteudo/empresa';
import {
  excluirProposta,
  importarPropostas,
  lerEmpresa,
  lerPropostas,
  proximoNumero,
  salvarEmpresa,
  salvarProposta,
} from './lib/armazenamento';
import { dataCurta } from './lib/documento';
import { brl, calcular } from './lib/preco';
import { propostaNova, type Proposta } from './lib/tipos';

type Aba = 'editor' | 'lista' | 'config';

const STATUS: Record<Proposta['status'], { rotulo: string; cor: string }> = {
  rascunho: { rotulo: 'Rascunho', cor: '#eaedf9' },
  enviada: { rotulo: 'Enviada', cor: '#e2e0ff' },
  aceita: { rotulo: 'Aceita', cor: '#dff3ec' },
  recusada: { rotulo: 'Recusada', cor: '#fdecea' },
};

export default function App() {
  const [empresa, setEmpresa] = useState<Empresa>(() => lerEmpresa());
  const [propostas, setPropostas] = useState<Proposta[]>(() => lerPropostas());
  const [proposta, setProposta] = useState<Proposta>(() => {
    const salvas = lerPropostas();
    return salvas[0] ?? propostaNova(proximoNumero(), lerEmpresa().responsavel);
  });
  const [aba, setAba] = useState<Aba>('editor');
  const [aviso, setAviso] = useState('');
  const [escala, setEscala] = useState(0.55);
  const palcoRef = useRef<HTMLDivElement>(null);

  const calculo = useMemo(
    () => calcular({ ...proposta.plano, precoPorUsuario: proposta.plano.precoPorUsuario }),
    [proposta.plano],
  );

  // a prévia se ajusta à largura disponível
  useEffect(() => {
    const el = palcoRef.current;
    if (!el) return;
    const medir = () => {
      const largura = el.clientWidth - 32;
      setEscala(Math.min(1, Math.max(0.3, largura / 794)));
    };
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(''), 3000);
    return () => clearTimeout(t);
  }, [aviso]);

  function salvar() {
    const salva = salvarProposta(proposta);
    setProposta(salva);
    setPropostas(lerPropostas());
    setAviso(`Orçamento ${salva.numero} salvo`);
  }

  function nova() {
    setProposta(propostaNova(proximoNumero(), empresa.responsavel));
    setAba('editor');
    setAviso('Novo orçamento iniciado');
  }

  function duplicar(base: Proposta) {
    const copia: Proposta = {
      ...structuredClone(base),
      id: crypto.randomUUID(),
      numero: proximoNumero(),
      criadoEm: new Date().toISOString(),
      status: 'rascunho',
    };
    setProposta(copia);
    setAba('editor');
    setAviso(`Cópia criada: ${copia.numero}`);
  }

  function apagar(id: string) {
    excluirProposta(id);
    setPropostas(lerPropostas());
    setAviso('Orçamento excluído');
  }

  function exportar() {
    const conteudo = JSON.stringify({ empresa, propostas: lerPropostas() }, null, 2);
    const url = URL.createObjectURL(new Blob([conteudo], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `ariuno-orcamentos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importar(arquivo: File) {
    arquivo.text().then((texto) => {
      try {
        const dados = JSON.parse(texto) as { empresa?: Empresa; propostas?: Proposta[] };
        if (dados.propostas) importarPropostas(dados.propostas);
        if (dados.empresa) {
          salvarEmpresa(dados.empresa);
          setEmpresa(dados.empresa);
        }
        setPropostas(lerPropostas());
        setAviso('Arquivo importado');
      } catch {
        setAviso('Não consegui ler esse arquivo');
      }
    });
  }

  return (
    <div className="min-h-screen">
      <header className="nao-imprime sticky top-0 z-20 bg-ink text-white">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-4">
            <Logotipo tamanho={26} claro />
            <span className="hidden text-[13px] text-white/50 sm:block">gerador de orçamentos</span>
          </div>
          <nav className="flex items-center gap-1">
            {([['editor', 'Orçamento'], ['lista', `Salvos (${propostas.length})`], ['config', 'Configurações']] as const).map(
              ([chave, rotulo]) => (
                <button
                  key={chave}
                  type="button"
                  onClick={() => setAba(chave as Aba)}
                  className="rounded-full px-4 py-2 text-[14px] font-medium transition-colors"
                  style={{
                    background: aba === chave ? 'rgb(255 255 255 / 0.14)' : 'transparent',
                    color: aba === chave ? '#fff' : 'rgb(255 255 255 / 0.6)',
                  }}
                >
                  {rotulo}
                </button>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Botao aoClicar={nova} tipo="apagado" pequeno>
              Novo
            </Botao>
            <Botao aoClicar={salvar} tipo="apagado" pequeno>
              Salvar
            </Botao>
            <Botao aoClicar={() => window.print()} tipo="claro">
              Gerar PDF
            </Botao>
          </div>
        </div>
        {aviso && <p className="bg-lime px-5 py-2 text-center text-[13px] font-medium text-ink">{aviso}</p>}
      </header>

      {aba === 'editor' && (
        <main className="mx-auto grid max-w-[1500px] gap-5 px-5 py-6 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
          <div className="nao-imprime">
            <div className="cartao mb-4 flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="rotulo-secao">Orçamento</p>
                <p className="font-display text-[20px] font-bold">{proposta.numero}</p>
              </div>
              <div className="text-right">
                <p className="rotulo-secao">{proposta.plano.ciclo === 'anual' ? 'anual à vista' : 'por mês'}</p>
                <p className="font-display text-[24px] font-extrabold text-iris">
                  {brl(proposta.plano.ciclo === 'anual' ? calculo.anualAVista : calculo.recorrenteMensal)}
                </p>
              </div>
              <label className="rotulo-campo w-full">
                Situação
                <select
                  className="campo mt-1"
                  value={proposta.status}
                  onChange={(e) => setProposta({ ...proposta, status: e.target.value as Proposta['status'] })}
                >
                  {Object.entries(STATUS).map(([chave, s]) => (
                    <option key={chave} value={chave}>
                      {s.rotulo}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Formulario proposta={proposta} calculo={calculo} aoMudar={setProposta} />

            <div className="cartao mt-4 p-4 text-[13px] leading-relaxed text-txt-2">
              <p className="rotulo-secao mb-2">Como fica a conta</p>
              <p>
                {calculo.usuarios} usuários na faixa {calculo.faixa.rotulo}, a {brl(calculo.porUsuario)} por usuário ao
                mês, dão {brl(calculo.mensalidade)} por mês
                {calculo.whiteLabel > 0 && ` mais ${brl(calculo.whiteLabel)} de marca própria`}.
                {proposta.plano.ciclo === 'anual'
                  ? ` No anual à vista, ${brl(calculo.anualAVista)} por ano, uma economia de ${brl(calculo.economiaAnual)}.`
                  : ` Em 12 meses, ${brl(calculo.recorrenteMensal * 12)}.`}
                {calculo.implantacao > 0 && ` A implantação de ${brl(calculo.implantacao)} entra uma única vez.`}
                {calculo.isentaImplantacao && ' A implantação saiu isenta pela regra do plano anual.'}
              </p>
              <p className="mt-2 font-medium text-ink">Primeiro pagamento: {brl(calculo.primeiroPagamento)}</p>
            </div>
          </div>

          <div ref={palcoRef} className="palco-impressao min-w-0">
            <div className="nao-imprime mb-3 flex items-center justify-between">
              <p className="rotulo-secao">Prévia do PDF</p>
              <p className="text-[13px] text-txt-3">
                {proposta.incluirContrato ? 'proposta + contrato' : 'somente a proposta'}
              </p>
            </div>
            <div
              style={{
                width: 794 * escala,
                height: 'auto',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  transform: `scale(${escala})`,
                  transformOrigin: 'top left',
                  width: 794,
                  boxShadow: '0 18px 50px -30px rgb(11 13 30 / 0.5)',
                }}
                className="palco-impressao"
              >
                <Documento proposta={proposta} empresa={empresa} calculo={calculo} />
              </div>
            </div>
          </div>
        </main>
      )}

      {aba === 'lista' && (
        <main className="nao-imprime mx-auto max-w-[1100px] px-5 py-6">
          <div className="cartao overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linha px-5 py-4">
              <h2 className="font-display text-[19px] font-bold">Orçamentos salvos</h2>
              <div className="flex gap-2">
                <Botao aoClicar={exportar} tipo="apagado" pequeno>
                  Exportar tudo
                </Botao>
                <label className="inline-flex cursor-pointer items-center rounded-full bg-paper-2 px-4 py-2 text-[13px] font-bold text-txt-2 transition-colors hover:bg-linha">
                  Importar
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && importar(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
            {propostas.length === 0 ? (
              <p className="px-5 py-8 text-[15px] text-txt-2">
                Nenhum orçamento salvo ainda. Monte um na aba Orçamento e clique em Salvar.
              </p>
            ) : (
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-paper text-left text-[13px] text-txt-2">
                    <th className="px-5 py-3">Número</th>
                    <th className="px-3 py-3">Cliente</th>
                    <th className="px-3 py-3">Usuários</th>
                    <th className="px-3 py-3">Valor</th>
                    <th className="px-3 py-3">Situação</th>
                    <th className="px-3 py-3">Criado</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {propostas.map((p) => {
                    const c = calcular(p.plano);
                    return (
                      <tr key={p.id} className="border-t border-linha">
                        <td className="px-5 py-3 font-mono text-[13px]">{p.numero}</td>
                        <td className="px-3 py-3">{p.cliente.nomeFantasia || p.cliente.razaoSocial || 'sem cliente'}</td>
                        <td className="px-3 py-3">{c.usuarios}</td>
                        <td className="px-3 py-3">{brl(p.plano.ciclo === 'anual' ? c.anualAVista : c.recorrenteMensal)}</td>
                        <td className="px-3 py-3">
                          <span className="rounded-full px-3 py-1 text-[12px]" style={{ background: STATUS[p.status].cor }}>
                            {STATUS[p.status].rotulo}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-txt-3">{dataCurta(p.criadoEm)}</td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <Botao aoClicar={() => { setProposta(p); setAba('editor'); }} tipo="apagado" pequeno>
                              Abrir
                            </Botao>
                            <Botao aoClicar={() => duplicar(p)} tipo="apagado" pequeno>
                              Duplicar
                            </Botao>
                            <Botao aoClicar={() => apagar(p.id)} tipo="perigo" pequeno>
                              Excluir
                            </Botao>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-txt-3">
            Os orçamentos ficam salvos neste navegador. Para passar a lista para outra pessoa do time, use Exportar
            tudo e peça para ela usar Importar.
          </p>
        </main>
      )}

      {aba === 'config' && (
        <main className="nao-imprime mx-auto flex max-w-[860px] flex-col gap-4 px-5 py-6">
          <Grupo
            titulo="Dados da empresa que assina o contrato"
            acao={
              <Botao
                aoClicar={() => {
                  salvarEmpresa(empresa);
                  setAviso('Dados da empresa salvos');
                }}
                pequeno
              >
                Salvar
              </Botao>
            }
          >
            <Texto rotulo="Razão social" valor={empresa.razaoSocial} aoMudar={(v) => setEmpresa({ ...empresa, razaoSocial: v })} />
            <Texto rotulo="Nome fantasia" valor={empresa.nomeFantasia} aoMudar={(v) => setEmpresa({ ...empresa, nomeFantasia: v })} largura="meia" />
            <Texto rotulo="CNPJ" valor={empresa.cnpj} aoMudar={(v) => setEmpresa({ ...empresa, cnpj: v })} largura="meia" />
            <Texto rotulo="Endereço completo" valor={empresa.endereco} aoMudar={(v) => setEmpresa({ ...empresa, endereco: v })} />
            <Texto rotulo="E-mail" valor={empresa.email} aoMudar={(v) => setEmpresa({ ...empresa, email: v })} largura="meia" />
            <Texto rotulo="Comarca do foro" valor={empresa.foro} aoMudar={(v) => setEmpresa({ ...empresa, foro: v })} largura="meia" />
          </Grupo>

          <Grupo
            titulo="Quem costuma assinar as propostas"
            acao={
              <Botao
                aoClicar={() => {
                  salvarEmpresa(empresa);
                  setAviso('Responsável salvo');
                }}
                pequeno
              >
                Salvar
              </Botao>
            }
          >
            <Texto rotulo="Nome" valor={empresa.responsavel.nome} aoMudar={(v) => setEmpresa({ ...empresa, responsavel: { ...empresa.responsavel, nome: v } })} largura="meia" />
            <Texto rotulo="Cargo" valor={empresa.responsavel.cargo} aoMudar={(v) => setEmpresa({ ...empresa, responsavel: { ...empresa.responsavel, cargo: v } })} largura="meia" />
            <Texto rotulo="E-mail" valor={empresa.responsavel.email} aoMudar={(v) => setEmpresa({ ...empresa, responsavel: { ...empresa.responsavel, email: v } })} largura="meia" />
            <Texto rotulo="Telefone" valor={empresa.responsavel.telefone} aoMudar={(v) => setEmpresa({ ...empresa, responsavel: { ...empresa.responsavel, telefone: v } })} largura="meia" />
          </Grupo>

          <div className="cartao p-5 text-[14px] leading-relaxed text-txt-2">
            <p className="rotulo-secao mb-2">Antes de mandar o primeiro contrato</p>
            <p>
              O contrato que sai no PDF foi redigido para a operação do Ariuno com a estrutura que escritórios
              brasileiros de direito digital apontam como essencial em SaaS. Ainda assim,{' '}
              <strong className="font-bold text-ink">peça uma leitura do seu advogado</strong> antes do primeiro
              envio, principalmente nas cláusulas de nível de serviço, limitação de responsabilidade e proteção de
              dados.
            </p>
            <p className="mt-2">
              Enquanto a razão social, o CNPJ e o endereço estiverem vazios aqui, o documento sai com marcações
              visíveis de preencher, para ninguém enviar por engano.
            </p>
            {empresa.razaoSocial === empresaPadrao.razaoSocial && (
              <p className="mt-3 rounded-[10px] bg-[#fdecea] px-4 py-3 text-alerta">
                Os dados da empresa ainda estão em branco.
              </p>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
