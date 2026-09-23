/** Monta o caminho de um arquivo da pasta public respeitando a base do build. */
export const urlPublica = (caminho: string) => `${import.meta.env.BASE_URL}${caminho}`;
