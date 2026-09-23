# Ariuno · gerador de orçamentos

Ferramenta interna do time comercial do Ariuno. Você preenche os dados do cliente,
mexe no número de usuários, e a plataforma calcula o valor pela tabela progressiva,
aplica desconto e gera o PDF com a proposta e o contrato de licença de uso.

**No ar:** https://projetos.75lab.com.br/ariuno-orcamentos/

## Como usar no dia a dia

1. **Configurações**, na primeira vez: preencha razão social, CNPJ, endereço e foro da
   empresa. Fica salvo no navegador e vale para todos os orçamentos seguintes.
2. **Orçamento**: dados do cliente, número de usuários, ciclo (mensal ou anual à vista),
   desconto e o que entra na proposta. A prévia do PDF atualiza a cada tecla.
3. **Gerar PDF**: abre a janela de impressão do navegador. Escolha *Salvar como PDF*,
   papel A4, margens padrão. O documento sai com a proposta e, se marcado, o contrato.
4. **Salvar**: guarda o orçamento na aba *Salvos*, com número sequencial
   (ORC-2026-001, 002...). De lá dá para abrir de novo, duplicar para outro cliente ou
   excluir.

## Como o valor é calculado

Tabela por faixa de usuários, com dois preços em cada faixa: um para quem fecha com
prazo (a partir de 6 meses) e outro para quem fica no mensal, sem compromisso de
permanência.

| Faixa | Com prazo | Mensal |
|---|---|---|
| até 5 usuários | R$ 179 | R$ 199 |
| 6 a 10 usuários | R$ 159 | R$ 179 |
| 11 a 15 usuários | R$ 139 | R$ 159 |
| acima de 15 usuários | R$ 119 | R$ 139 |

Na tela, as duas opções aparecem lado a lado com o valor de cada uma, para o vendedor
mostrar a diferença na hora. Escolhendo prazo, o campo de meses fica disponível com
mínimo de 6, e a proposta passa a exibir a economia do período contra o mensal.

Sobre esse valor a ferramenta aplica:

- **desconto comercial** em porcentagem, que incide no valor por usuário;
- **marca própria (white-label)**, somada como valor mensal fixo;
- **implantação**, cobrada uma única vez;
- **preço por usuário digitado na mão**, para negociação fora da tabela.

### Bonificado

A implantação e a marca própria têm a opção **bonificada**. Marcando a caixa, o item
continua aparecendo na proposta com o valor riscado e a palavra *bonificada* ao lado,
mas não entra em nenhuma soma. No fim da proposta sai a linha
"Bonificação nesta proposta: R$ X", que é o total do que o cliente deixou de pagar.
Serve para mostrar valor sem cobrar.

### Regras comerciais que estão no contrato

- **Reajuste semestral** pelo IPCA, aplicado na primeira fatura depois de fechado o semestre.
- **Ajuste por melhoria significativa**: se a plataforma ganhar módulo, integração ou
  recurso que amplie de verdade o escopo e aumente o custo de operação, o valor por
  usuário pode ser ajustado com aviso de 30 dias. Se o cliente não concordar, ele encerra
  sem multa.
- **Encerramento antes do prazo**: multa de 30% sobre as mensalidades faltantes, em
  parcela única. Não vale quando a culpa é da 75 LAB nem quando o cliente recusa um
  ajuste por melhoria.
- **Fim do contrato**: os dados ficam guardados por 15 dias para o cliente extrair pelos
  próprios recursos da plataforma. Não há extração por API nem entrega de cópia do banco.
  Passados os 15 dias, os dados são eliminados.
- **Anexo I**: o cartão CNPJ da 75 LAB entra como última página e é citado nas
  disposições gerais. A imagem fica em `public/anexos/`; para trocar por uma emissão mais
  nova, é só substituir o arquivo.

### Liberação só depois do pagamento

A regra está na proposta, em Condições, e no contrato em duas cláusulas: os acessos e o
início da implantação ficam condicionados à confirmação do primeiro pagamento, e os
prazos só começam a correr a partir daí. A vigência conta da liberação dos acessos, não
da assinatura.

## O contrato que sai no PDF

O contrato foi redigido para a 75 LAB a partir da estrutura que escritórios brasileiros
de direito digital apontam como essencial em contratos de software como serviço. São 22
cláusulas: objeto, licença de uso, usuários e credenciais, implantação, prazo e
renovação, preço e reajuste, alteração do número de usuários, nível de serviço com
crédito por indisponibilidade, suporte, obrigações das duas partes, propriedade
intelectual, titularidade dos dados, LGPD com papéis de controlador e operador,
segurança, confidencialidade, limitação de responsabilidade, rescisão, devolução e
eliminação de dados, marca própria, anticorrupção, disposições gerais e foro.

A cláusula de prazo muda conforme a contratação: no plano com prazo, entra o compromisso
de permanência e a consequência de encerrar antes (cobrança da diferença para a tabela
sem fidelidade nos meses já usados); no mensal, entra a permissão de encerrar ao fim de
qualquer mês.

O texto é preenchido sozinho com os dados da negociação: valor por usuário, valor mensal,
primeiro pagamento, número de usuários, vigência, forma de pagamento e dia de vencimento.
A cláusula de marca própria só aparece quando o white-label está no orçamento.

**Antes do primeiro envio, peça uma leitura do seu advogado**, principalmente nas
cláusulas de nível de serviço, limitação de responsabilidade e proteção de dados. O
texto está em `src/conteudo/contrato.ts` e é só editar a lista de cláusulas.

Enquanto a razão social, o CNPJ e o endereço da empresa não forem preenchidos nas
Configurações, o PDF sai com marcações visíveis de PREENCHER, de propósito, para ninguém
enviar um contrato pela metade.

## O PDF

- A4, com rodapé em **todas as páginas**: símbolo do Ariuno, nome da empresa, número do
  orçamento, nome do cliente, data e endereço da plataforma.
- Página 1 é a proposta: cabeçalho, dados do cliente, investimento em destaque, tabela de
  composição, o que está incluído, condições e espaço de observações.
- Da página 2 em diante, o contrato, terminando com as assinaturas das duas partes e de
  duas testemunhas.
- O rodapé se repete porque cada folha é uma tabela com `tfoot`, que é a forma que o
  Chrome respeita na impressão. Posição fixa no rodapé não funciona, o rodapé vaza para o
  topo das páginas seguintes.

## Onde ficam os orçamentos

No navegador de quem gerou (localStorage). Não há servidor: nenhum dado de cliente sai da
máquina. Para passar a lista para outra pessoa do time, use **Exportar tudo** na aba
Salvos e peça para ela usar **Importar**.

Se um dia o time quiser uma lista compartilhada, o caminho mais curto é o mesmo já usado
no site do Ariuno: um Apps Script gravando numa planilha. Aí cada orçamento salvo vira
uma linha visível para todos.

## Rodar e publicar

```bash
npm install
npm run dev      # http://localhost:5190
npm run build    # gera docs/ para o GitHub Pages
npm run lint     # checagem de tipos
```

O build vai para `docs/` e o GitHub Pages serve essa pasta na branch `main`.

## Tecnologias

React 19, TypeScript, Vite 7, Tailwind CSS 4. Sem biblioteca de PDF: o documento é HTML
com folha de estilo de impressão, o que deixa o texto do contrato selecionável e
pesquisável no PDF final.

## Aviso sobre o link

O endereço é público, sem senha, como os outros projetos da conta. Não há dado de cliente
no servidor, mas quem tiver o link vê a tabela de preços e o contrato. Se preferir
restringir, dá para publicar num repositório privado com acesso por convite ou colocar
atrás de uma senha simples.
