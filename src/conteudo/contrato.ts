/**
 * Contrato de licença de uso da plataforma Ariuno em modelo SaaS.
 *
 * Redigido para a 75 LAB a partir da estrutura que escritórios brasileiros de
 * direito digital apontam como essencial em contratos de software como serviço:
 * objeto e licença, usuários, implantação, prazo e renovação, preço e reajuste,
 * nível de serviço com créditos, propriedade intelectual, titularidade dos dados,
 * LGPD com papéis de controlador e operador, segurança, confidencialidade,
 * limitação de responsabilidade, rescisão e devolução de dados.
 *
 * Os trechos entre chaves são preenchidos com os dados do orçamento.
 * Cláusulas marcadas com `quando` só entram no documento se a condição for
 * verdadeira (por exemplo, a de marca própria só aparece se o white-label
 * estiver no orçamento).
 */

export type Clausula = {
  titulo: string;
  itens: string[];
  quando?: 'whiteLabel' | 'piloto' | 'anual';
};

export const clausulas: Clausula[] = [
  {
    titulo: 'Do objeto',
    itens: [
      'O presente instrumento tem por objeto a licença de uso, pela CONTRATANTE, da plataforma {{MARCA}}, software de gestão de operação disponibilizado pela CONTRATADA no modelo de software como serviço (SaaS), acessível pela internet no endereço {{PLATAFORMA_URL}}, nas condições comerciais descritas na proposta que integra este contrato.',
      'A plataforma é disponibilizada no estado em que se encontra na data da contratação, com as funcionalidades publicamente descritas pela CONTRATADA, e pode receber evoluções, correções e novas funcionalidades ao longo da vigência, sem custo adicional, desde que não reduzam o escopo contratado.',
      'A proposta comercial nº {{NUMERO}}, datada de {{DATA_EXTENSO}}, é parte integrante e indissociável deste contrato. Em caso de divergência entre a proposta e este contrato, prevalecem as condições comerciais da proposta.',
    ],
  },
  {
    titulo: 'Da licença de uso',
    itens: [
      'A CONTRATADA concede à CONTRATANTE licença de uso não exclusiva, intransferível, revogável e limitada à vigência deste contrato, restrita ao território nacional e ao uso interno da CONTRATANTE e de seus clientes finais, na forma da cláusula seguinte.',
      'A licença não implica cessão, venda ou transferência de qualquer direito de propriedade sobre a plataforma, seu código-fonte, sua arquitetura, sua documentação ou suas marcas.',
      'É vedado à CONTRATANTE, por si ou por terceiros: (a) sublicenciar, ceder, alugar, emprestar ou revender o acesso à plataforma a terceiros não previstos neste contrato; (b) realizar engenharia reversa, descompilar, desmontar ou tentar obter o código-fonte; (c) copiar, reproduzir ou criar obra derivada da plataforma; (d) remover ou alterar avisos de propriedade intelectual; (e) utilizar a plataforma para finalidade ilícita ou que viole direitos de terceiros.',
      'O descumprimento desta cláusula autoriza a CONTRATADA a suspender o acesso imediatamente, sem prejuízo da rescisão por justa causa e da reparação das perdas e danos.',
    ],
  },
  {
    titulo: 'Dos usuários e das credenciais',
    itens: [
      'A contratação abrange {{USUARIOS}} usuários ativos, assim entendidas as pessoas com credencial própria de acesso à plataforma, vinculadas à CONTRATANTE.',
      'Usuários do tipo cliente, que apenas acompanham o andamento dos trabalhos, aprovam entregas e abrem solicitações, são ilimitados e não ocupam posição de usuário ativo, não gerando custo adicional.',
      'As credenciais são pessoais e intransferíveis. É vedado o compartilhamento de uma mesma credencial entre pessoas distintas. A CONTRATANTE é responsável pela guarda das credenciais e por todos os atos praticados por seus usuários na plataforma.',
      'A CONTRATANTE deve comunicar imediatamente à CONTRATADA qualquer suspeita de uso não autorizado, perda de credencial ou incidente de segurança que envolva o acesso à plataforma.',
    ],
  },
  {
    titulo: 'Da implantação, da migração e do treinamento',
    itens: [
      'A implantação compreende a configuração da plataforma conforme o fluxo de trabalho da CONTRATANTE, a criação de quadros, campos, modelos, áreas e permissões, a migração dos clientes, projetos e tarefas em andamento e o treinamento do time por função.',
      'A implantação é executada de forma conjunta e depende da colaboração da CONTRATANTE no fornecimento de informações, bases e disponibilidade de agenda. Atrasos causados pela ausência dessas providências não são imputáveis à CONTRATADA.',
      'O prazo estimado de 21 dias corridos entre o início dos trabalhos e a entrada em operação, distribuídos em descoberta, configuração, migração, treinamento e go-live, é contado da confirmação do primeiro pagamento, e não da assinatura.',
      'O valor da implantação está descrito na proposta. {{TEXTO_IMPLANTACAO}}',
    ],
  },
  {
    titulo: 'Do prazo, da vigência e da renovação',
    itens: [
      'Este contrato vigora pelo prazo de {{VIGENCIA_MESES}} meses, contados da liberação dos acessos, e é renovado automaticamente por períodos iguais e sucessivos, salvo manifestação escrita de qualquer das partes com antecedência mínima de 30 dias do término do período em curso.',
      '{{TEXTO_FIDELIDADE}}',
      'A denúncia imotivada no curso de um período já pago não gera direito à devolução dos valores correspondentes ao período em andamento, permanecendo o acesso disponível até o fim do período pago.',
    ],
  },
  {
    titulo: 'Do preço, do reajuste e do pagamento',
    itens: [
      'Pela licença de uso, a CONTRATANTE pagará à CONTRATADA o valor de {{VALOR_POR_USUARIO}} por usuário ativo ao mês, totalizando {{VALOR_MENSAL}} por mês para os {{USUARIOS}} usuários contratados. {{TEXTO_WHITE_LABEL_PRECO}}',
      '{{TEXTO_CICLO_PAGAMENTO}}',
      'O primeiro pagamento, no valor de {{PRIMEIRO_PAGAMENTO}}, vence em até 5 dias úteis da assinatura.',
      'A liberação dos acessos à plataforma e o início da implantação ficam condicionados à confirmação do recebimento do primeiro pagamento. Enquanto esse pagamento não for confirmado, nenhum prazo deste contrato começa a correr.',
      'Os valores são reajustados a cada 12 meses de vigência pela variação positiva do IPCA/IBGE acumulado no período, ou pelo índice que o substituir na sua falta.',
      'O atraso no pagamento sujeita a CONTRATANTE a multa de 2% sobre o valor em aberto, juros de mora de 1% ao mês, pro rata die, e correção pelo mesmo índice previsto no item anterior.',
      'O atraso superior a 15 dias autoriza a suspensão do acesso à plataforma, mediante aviso prévio de 5 dias, mantidos os dados da CONTRATANTE preservados durante a suspensão. O atraso superior a 60 dias autoriza a rescisão por justa causa.',
      'Os valores não incluem tributos que venham a ser criados ou majorados após a assinatura, os quais serão repassados nos termos da legislação.',
    ],
  },
  {
    titulo: 'Da alteração do número de usuários',
    itens: [
      'A CONTRATANTE pode incluir novos usuários a qualquer tempo, pela própria plataforma ou mediante solicitação, com cobrança proporcional aos dias restantes do ciclo em curso.',
      'A inclusão de usuários que leve a contratação a outra faixa da tabela passa a valer com o preço da nova faixa para a totalidade dos usuários da conta, a partir do ciclo seguinte.',
      'A redução do número de usuários tem efeito no ciclo seguinte ao pedido e pode levar a contratação a uma faixa de preço superior por usuário, conforme a tabela vigente. A redução não gera devolução de valores do ciclo em andamento.',
    ],
  },
  {
    titulo: 'Do nível de serviço',
    itens: [
      'A CONTRATADA compromete-se com disponibilidade mensal mínima de 99,5% da plataforma, apurada mês a mês, excluídas do cálculo as janelas de manutenção programada, as indisponibilidades causadas por terceiros fora do controle da CONTRATADA, os casos fortuitos ou de força maior e as falhas de conexão ou de equipamento da CONTRATANTE.',
      'As manutenções programadas são comunicadas com antecedência mínima de 48 horas e realizadas preferencialmente fora do horário comercial.',
      'Caso a disponibilidade apurada fique abaixo do compromisso, a CONTRATANTE terá direito a crédito equivalente a 10% da mensalidade do mês afetado para cada ponto percentual abaixo de 99,5%, limitado a 30% da mensalidade, a ser abatido na fatura seguinte, mediante solicitação em até 30 dias do fato.',
      'O crédito previsto nesta cláusula é o único remédio devido pela indisponibilidade, salvo nos casos de dolo ou culpa grave.',
    ],
  },
  {
    titulo: 'Do suporte técnico',
    itens: [
      'O suporte é prestado em português, por e-mail e pelos canais informados na plataforma, em dias úteis, das 9h às 18h, horário de Brasília.',
      'Os prazos de primeira resposta observam a criticidade: até 4 horas úteis para incidentes que impeçam o uso da plataforma por todos os usuários; até 8 horas úteis para falhas que afetem parte das funcionalidades; até 2 dias úteis para dúvidas, orientações e pedidos de melhoria.',
      'O suporte não abrange a correção de problemas causados por uso indevido, por integrações não homologadas ou por infraestrutura da CONTRATANTE, hipótese em que eventual atendimento poderá ser orçado à parte.',
    ],
  },
  {
    titulo: 'Das obrigações da contratada',
    itens: [
      'Disponibilizar a plataforma nas condições contratadas, mantendo a infraestrutura, a hospedagem e as rotinas de backup necessárias à sua operação.',
      'Executar a implantação e o treinamento na forma da cláusula respectiva.',
      'Prestar suporte técnico nos prazos acordados.',
      'Manter rotina de cópia de segurança dos dados da CONTRATANTE, com retenção mínima de 30 dias.',
      'Comunicar à CONTRATANTE, com antecedência razoável, alterações relevantes de funcionalidades que afetem o uso contratado.',
      'Guardar sigilo sobre as informações da CONTRATANTE, na forma da cláusula de confidencialidade.',
    ],
  },
  {
    titulo: 'Das obrigações da contratante',
    itens: [
      'Efetuar os pagamentos nas datas acordadas.',
      'Utilizar a plataforma conforme este contrato e a legislação aplicável, respondendo pelo conteúdo que nela inserir.',
      'Manter seus dados cadastrais atualizados e indicar um responsável para as tratativas do contrato.',
      'Zelar pela guarda das credenciais e pelo uso adequado por seus usuários.',
      'Fornecer, na implantação, as informações e as bases necessárias à configuração e à migração.',
      'Não inserir na plataforma dados pessoais sensíveis sem necessidade justificada e sem base legal adequada, nem conteúdo ilícito.',
    ],
  },
  {
    titulo: 'Da propriedade intelectual',
    itens: [
      'A plataforma {{MARCA}}, incluindo código-fonte, arquitetura, banco de dados, layout, telas, marcas, nomes de domínio, documentação e materiais correlatos, é de titularidade exclusiva da CONTRATADA, protegida pela Lei 9.609/1998, pela Lei 9.610/1998 e pela Lei 9.279/1996.',
      'Configurações, quadros, modelos e parametrizações criados durante a implantação não transferem à CONTRATANTE qualquer direito sobre a plataforma, permanecendo como forma de uso da licença concedida.',
      'Sugestões, críticas e pedidos de melhoria enviados pela CONTRATANTE podem ser livremente utilizados pela CONTRATADA no desenvolvimento do produto, sem que isso gere direito a remuneração, coautoria ou exclusividade.',
      'A CONTRATADA poderá citar a CONTRATANTE como cliente, com uso de nome e marca, em materiais comerciais e institucionais, salvo manifestação contrária por escrito da CONTRATANTE.',
    ],
  },
  {
    titulo: 'Da titularidade dos dados',
    itens: [
      'Todos os dados inseridos na plataforma pela CONTRATANTE, por seus usuários ou por seus clientes são de titularidade exclusiva da CONTRATANTE.',
      'A CONTRATADA não utiliza os dados da CONTRATANTE para finalidade diversa da execução deste contrato, não os comercializa e não os compartilha com terceiros, ressalvadas as hipóteses de ordem judicial ou de determinação de autoridade competente.',
      'A CONTRATADA poderá utilizar dados agregados e anonimizados, que não permitam identificar a CONTRATANTE nem qualquer pessoa natural, para fins estatísticos e de melhoria do produto.',
    ],
  },
  {
    titulo: 'Da proteção de dados pessoais',
    itens: [
      'As partes obrigam-se a cumprir a Lei 13.709/2018 (LGPD) e as demais normas aplicáveis à proteção de dados pessoais.',
      'Para os dados pessoais inseridos na plataforma pela CONTRATANTE, esta figura como CONTROLADORA e a CONTRATADA como OPERADORA, tratando os dados exclusivamente conforme as instruções da CONTRATANTE e nos limites deste contrato.',
      'A CONTRATADA poderá contratar suboperadores para hospedagem e serviços de infraestrutura, permanecendo responsável perante a CONTRATANTE e obrigando-se a impor a eles as mesmas obrigações de proteção de dados. A relação dos suboperadores em uso é informada à CONTRATANTE mediante solicitação.',
      'A CONTRATADA auxiliará a CONTRATANTE, na medida do razoável, no atendimento aos pedidos de titulares de dados e às requisições da Autoridade Nacional de Proteção de Dados.',
      'Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a CONTRATADA comunicará a CONTRATANTE em até 48 horas da ciência do fato, com as informações disponíveis, cabendo à CONTRATANTE, como controladora, a comunicação à ANPD e aos titulares quando devida.',
      'Encerrado o contrato, os dados pessoais serão devolvidos e eliminados na forma da cláusula de devolução e eliminação de dados.',
    ],
  },
  {
    titulo: 'Da segurança da informação',
    itens: [
      'A CONTRATADA adota medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, perda, alteração e destruição, entre elas o isolamento lógico dos dados de cada empresa, o controle de acesso por perfil e por área, o tráfego criptografado e a rotina de cópia de segurança.',
      'A CONTRATANTE reconhece que nenhum sistema é integralmente imune e que a segurança depende também das práticas adotadas por ela e por seus usuários, em especial quanto à guarda de credenciais.',
      'A infraestrutura de hospedagem é contratada de provedores de nuvem de mercado, com data centers que atendem a padrões reconhecidos de segurança.',
    ],
  },
  {
    titulo: 'Da confidencialidade',
    itens: [
      'As partes obrigam-se a manter sigilo sobre todas as informações a que tiverem acesso em razão deste contrato, incluindo dados de clientes, informações financeiras, estratégias comerciais, know-how e características do software.',
      'A obrigação de sigilo não se aplica às informações que já sejam públicas, que se tornem públicas sem violação deste contrato, que já fossem legitimamente conhecidas pela parte receptora ou cuja divulgação seja exigida por lei ou por autoridade competente, caso em que a parte comunicará previamente a outra, sempre que possível.',
      'A obrigação de confidencialidade permanece em vigor por 5 anos após o término deste contrato.',
    ],
  },
  {
    titulo: 'Da limitação de responsabilidade',
    itens: [
      'A responsabilidade total da CONTRATADA por perdas e danos decorrentes deste contrato fica limitada ao valor efetivamente pago pela CONTRATANTE nos 12 meses anteriores ao evento que der causa à responsabilização.',
      'Nenhuma das partes responde por lucros cessantes, perda de oportunidade, perda de dados causada por ato da outra parte ou danos indiretos.',
      'As limitações deste contrato não se aplicam às hipóteses de dolo, de culpa grave, de violação de confidencialidade e de responsabilidade decorrente da legislação de proteção de dados pessoais.',
      'A CONTRATADA não responde por indisponibilidade ou falha causada por terceiros, por interrupção de energia ou de conexão, por caso fortuito ou força maior.',
    ],
  },
  {
    titulo: 'Da rescisão',
    itens: [
      'Este contrato pode ser rescindido: (a) por qualquer das partes, imotivadamente, mediante aviso prévio escrito de 30 dias; (b) por qualquer das partes, por justa causa, em caso de descumprimento de obrigação não sanada em 15 dias contados da notificação; (c) de pleno direito, em caso de falência, recuperação judicial ou insolvência de qualquer das partes.',
      'A rescisão não afasta a obrigação de pagamento dos valores devidos até a data do encerramento.',
      'Em caso de rescisão por justa causa provocada pela CONTRATANTE, o acesso poderá ser encerrado imediatamente, observado o direito à extração dos dados na forma da cláusula seguinte.',
    ],
  },
  {
    titulo: 'Da devolução e da eliminação dos dados',
    itens: [
      'Encerrado o contrato por qualquer motivo, a CONTRATANTE terá prazo de 30 dias corridos para extrair seus dados da plataforma em formato estruturado e de uso corrente, como CSV, JSON ou PDF, conforme o tipo de informação.',
      'A pedido da CONTRATANTE feito dentro desse prazo, a CONTRATADA fornecerá cópia integral dos dados em formato estruturado, sem custo adicional.',
      'Decorridos 90 dias do encerramento, a CONTRATADA eliminará os dados da CONTRATANTE de seus ambientes produtivos e de backup, salvo aqueles cuja guarda seja exigida por lei, e confirmará a eliminação por escrito mediante solicitação.',
    ],
  },
  {
    titulo: 'Da marca própria',
    quando: 'whiteLabel',
    itens: [
      'Contratado o módulo de marca própria, a plataforma será disponibilizada com a identidade visual da CONTRATANTE, em domínio por ela indicado, mediante o valor mensal descrito na proposta.',
      'A CONTRATANTE declara ser titular ou legítima licenciada das marcas e dos elementos visuais fornecidos e responde por eventual violação de direitos de terceiros, isentando a CONTRATADA.',
      'A personalização não altera a titularidade da plataforma, que permanece com a CONTRATADA, nem autoriza a CONTRATANTE a declarar-se desenvolvedora do software.',
      'A manutenção do domínio indicado pela CONTRATANTE, incluindo registro e certificado, é de sua responsabilidade, com apoio técnico da CONTRATADA na configuração.',
    ],
  },
  {
    titulo: 'Da anticorrupção e da conduta',
    itens: [
      'As partes declaram conhecer e obrigam-se a cumprir a Lei 12.846/2013 e as demais normas anticorrupção aplicáveis, abstendo-se de oferecer, prometer ou aceitar vantagem indevida em razão deste contrato.',
      'As partes declaram não utilizar trabalho infantil, trabalho análogo ao escravo ou qualquer prática que viole direitos humanos e a legislação trabalhista.',
    ],
  },
  {
    titulo: 'Das disposições gerais',
    itens: [
      'Este contrato não estabelece vínculo societário, trabalhista, de consórcio ou de representação entre as partes, que atuam de forma autônoma e independente.',
      'A tolerância de qualquer das partes quanto ao descumprimento de obrigação não implica novação nem renúncia de direito.',
      'A nulidade de qualquer cláusula não prejudica a validade das demais.',
      'A cessão deste contrato a terceiros depende de anuência prévia e escrita da outra parte, ressalvada a cessão decorrente de reorganização societária, caso em que bastará a comunicação.',
      'As comunicações entre as partes serão feitas por escrito, preferencialmente por e-mail, para os endereços indicados no preâmbulo, considerando-se recebidas na data do envio quando houver confirmação de leitura ou resposta.',
      'As partes reconhecem a validade da assinatura eletrônica deste contrato, nos termos do artigo 10, parágrafo 2º, da Medida Provisória 2.200-2/2001, e da Lei 14.063/2020.',
      'Este contrato, com a proposta que o integra, representa o entendimento integral entre as partes sobre o seu objeto e substitui tratativas anteriores.',
    ],
  },
  {
    titulo: 'Do foro',
    itens: [
      'Fica eleito o foro da comarca de {{FORO}} para dirimir as questões oriundas deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.',
    ],
  },
];

export const preambulo =
  'Pelo presente instrumento particular, de um lado {{CONTRATADA_RAZAO}}, inscrita no CNPJ sob o nº {{CONTRATADA_CNPJ}}, com sede em {{CONTRATADA_ENDERECO}}, doravante denominada CONTRATADA, desenvolvedora e titular da plataforma {{MARCA}}, e de outro lado {{CLIENTE_RAZAO}}, inscrita no CNPJ sob o nº {{CLIENTE_CNPJ}}, com sede em {{CLIENTE_ENDERECO}}, doravante denominada CONTRATANTE, ambas qualificadas nesta proposta, têm entre si justo e contratado o seguinte:';

export const fechoContrato =
  'E, por estarem assim justas e contratadas, as partes assinam o presente instrumento, que passa a vigorar a partir da data da última assinatura.';
