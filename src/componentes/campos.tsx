import type { ReactNode } from 'react';

export function Texto({
  rotulo,
  valor,
  aoMudar,
  tipo = 'text',
  dica,
  largura = 'cheia',
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  tipo?: string;
  dica?: string;
  largura?: 'cheia' | 'meia';
}) {
  const id = `c-${rotulo.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={largura === 'meia' ? '' : 'sm:col-span-2'}>
      <label className="rotulo-campo" htmlFor={id}>
        {rotulo}
      </label>
      <input id={id} type={tipo} className="campo" value={valor} placeholder={dica} onChange={(e) => aoMudar(e.target.value)} />
    </div>
  );
}

export function Numero({
  rotulo,
  valor,
  aoMudar,
  min,
  max,
  passo = 1,
  sufixo,
}: {
  rotulo: string;
  valor: number;
  aoMudar: (v: number) => void;
  min?: number;
  max?: number;
  passo?: number;
  sufixo?: string;
}) {
  const id = `n-${rotulo.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div>
      <label className="rotulo-campo" htmlFor={id}>
        {rotulo}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          className="campo"
          value={Number.isFinite(valor) ? valor : ''}
          min={min}
          max={max}
          step={passo}
          onChange={(e) => aoMudar(Number(e.target.value))}
        />
        {sufixo && <span className="shrink-0 text-[13px] text-txt-3">{sufixo}</span>}
      </div>
    </div>
  );
}

export function Area({ rotulo, valor, aoMudar, linhas = 3 }: { rotulo: string; valor: string; aoMudar: (v: string) => void; linhas?: number }) {
  const id = `a-${rotulo.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="sm:col-span-2">
      <label className="rotulo-campo" htmlFor={id}>
        {rotulo}
      </label>
      <textarea id={id} className="campo resize-y" rows={linhas} value={valor} onChange={(e) => aoMudar(e.target.value)} />
    </div>
  );
}

export function Chave({ rotulo, ativo, aoMudar, detalhe }: { rotulo: string; ativo: boolean; aoMudar: (v: boolean) => void; detalhe?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[10px] bg-paper px-3 py-3 sm:col-span-2">
      <input type="checkbox" checked={ativo} onChange={(e) => aoMudar(e.target.checked)} className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-[#6A5CFF]" />
      <span>
        <span className="block text-[15px] font-medium">{rotulo}</span>
        {detalhe && <span className="mt-[2px] block text-[13px] leading-snug text-txt-3">{detalhe}</span>}
      </span>
    </label>
  );
}

export function Grupo({ titulo, children, acao }: { titulo: string; children: ReactNode; acao?: ReactNode }) {
  return (
    <section className="cartao p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-[17px] font-bold">{titulo}</h2>
        {acao}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function Botao({
  children,
  aoClicar,
  tipo = 'principal',
  pequeno = false,
}: {
  children: ReactNode;
  aoClicar: () => void;
  tipo?: 'principal' | 'claro' | 'apagado' | 'perigo';
  pequeno?: boolean;
}) {
  const estilos = {
    principal: 'bg-iris text-white hover:bg-iris-d',
    claro: 'bg-lime text-ink hover:bg-[#d4ff66]',
    apagado: 'bg-paper-2 text-txt-2 hover:bg-linha',
    perigo: 'bg-[#fdecea] text-alerta hover:bg-[#f9d9d5]',
  }[tipo];
  return (
    <button
      type="button"
      onClick={aoClicar}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-200 ${estilos} ${
        pequeno ? 'px-4 py-2 text-[13px]' : 'px-5 py-[11px] text-[14px]'
      }`}
    >
      {children}
    </button>
  );
}
