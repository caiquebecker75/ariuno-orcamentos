export function Marca({ tamanho = 28, cor = 'gradiente' }: { tamanho?: number; cor?: 'gradiente' | 'ink' | 'branco' }) {
  const id = `marca-${cor}`;
  const traco = cor === 'gradiente' ? `url(#${id})` : cor === 'branco' ? '#fff' : '#0B0D1E';
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6A5CFF" />
          <stop offset="45%" stopColor="#4285FF" />
          <stop offset="100%" stopColor="#00C2A8" />
        </linearGradient>
      </defs>
      <path d="M25,80 C10,80 15,55 30,55 C42,55 45,68 40,80 L75,15 L95,75" stroke={traco} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40,80 L95,75" stroke={traco} strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

export function Logotipo({ tamanho = 28, claro = false }: { tamanho?: number; claro?: boolean }) {
  return (
    <span className="inline-flex items-center gap-[9px]">
      <Marca tamanho={tamanho} cor="gradiente" />
      <span
        className="font-display font-extrabold tracking-[-0.045em]"
        style={{ fontSize: tamanho * 0.72, color: claro ? '#fff' : '#0B0D1E' }}
      >
        ariuno
      </span>
    </span>
  );
}
