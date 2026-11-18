/* ==============================================================
   Agente da Nuvem · Parte 2: a contra-ofensiva · versão 2 · 2026-11-18 (trava: só depois da Parte 1)
   Jogo de decisões sobre resposta a incidentes (aula 14): 5 fases, 3 medidores.
   Treino sem nota. Só abre para quem entregou a credencial certa na Parte 1 (login @edu); o jogo em si não grava nada.
   ============================================================== */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const parado = () => document.documentElement.classList.contains("pausado");

  // os três medidores da clínica (0 a 100)
  const medidores = { dados: 100, clinica: 100, pistas: 100 };
  let acertos = 0;
  let fase = -1;   // -1 = briefing

  // cada fase: o alerta, as opções e o que acontece em cada uma (efeito nos medidores)
  const FASES = [
    {
      nome: "Contenção",
      ico: "🚧",
      alerta: "08h12 · O painel acende: a conta de armazenamento das fichas continua com acesso público, e a senha do banco que vazou no GitHub ainda funciona. Os invasores podem voltar a qualquer minuto.",
      pergunta: "Primeiro movimento: como você segura o estrago?",
      opcoes: [
        { texto: "Desligar a nuvem inteira da clínica agora mesmo.", efeito: { dados: 0, clinica: -45, pistas: -10 }, certo: false,
          porque: "As fichas ficaram protegidas, mas a clínica parou: sem agenda, sem receitas, sem prontuário. Contenção é <b>proporcional</b>: feche a porta arrombada, não o prédio inteiro." },
        { texto: "Bloquear o acesso público da conta de armazenamento e trocar (rotacionar) a senha do banco.", efeito: { dados: 0, clinica: -5, pistas: 0 }, certo: true,
          porque: "Contenção cirúrgica: você fechou as duas portas que os invasores usaram e a clínica continuou atendendo. A senha vazada virou lixo." },
        { texto: "Apagar os logs para \"limpar\" a sujeira dos invasores.", efeito: { dados: -20, clinica: 0, pistas: -60 }, certo: false,
          porque: "Apagou as pistas! Sem log, ninguém sabe por onde entraram nem o que levaram. E as portas continuam abertas. Log é a câmera de segurança: nunca se apaga a gravação do crime." },
        { texto: "Esperar mais um dia para ver o que eles vão fazer.", efeito: { dados: -50, clinica: 0, pistas: 0 }, certo: false,
          porque: "Enquanto você observava, eles baixaram mais fichas. Em incidente com dado de saúde, cada hora conta: primeiro conter, depois investigar." },
      ],
    },
    {
      nome: "Erradicação",
      ico: "🧹",
      alerta: "09h40 · Investigando o log de atividades, você descobre que os invasores criaram um usuário chamado <code>suporte-ti</code>, deram a ele o papel de <b>Proprietário</b> (Owner) da assinatura e geraram uma chave de acesso.",
      pergunta: "Como você tira os invasores de vez?",
      opcoes: [
        { texto: "Trocar só a senha do usuário suporte-ti.", efeito: { dados: -25, clinica: 0, pistas: 0 }, certo: false,
          porque: "A chave de acesso que eles criaram continua funcionando, com ou sem senha nova. E o usuário falso continua lá, como Proprietário." },
        { texto: "Remover o usuário falso, revogar as chaves e as sessões dele e revisar quem mais é Proprietário.", efeito: { dados: 0, clinica: 0, pistas: 0 }, certo: true,
          porque: "Erradicação completa: sem usuário, sem chave, sem sessão aberta. E a revisão dos Proprietários aplica o <b>menor privilégio</b>: ninguém precisa ser dono da assinatura para trabalhar." },
        { texto: "Remover o usuário, mas deixar a chave de acesso, porque \"pode ser de algum sistema\".", efeito: { dados: -30, clinica: 0, pistas: 0 }, certo: false,
          porque: "A chave foi criada pelos invasores: é a porta dos fundos deles. Na dúvida, revoga: sistema legítimo a gente reconfigura depois." },
      ],
    },
    {
      nome: "Recuperação",
      ico: "🔧",
      alerta: "11h05 · Os invasores saíram. Mas o sistema da clínica precisa da senha nova do banco para voltar a funcionar.",
      pergunta: "Onde a senha nova fica guardada?",
      opcoes: [
        { texto: "No código de novo, só que agora num repositório privado.", efeito: { dados: -20, clinica: 0, pistas: 0 }, certo: false,
          porque: "Repositório privado vaza também (um colaborador, um fork, um backup). Segredo não mora no código, nem escondido." },
        { texto: "No Key Vault, e o sistema lê de lá com uma identidade gerenciada, sem senha no código.", efeito: { dados: 0, clinica: 0, pistas: 0 }, certo: true,
          porque: "É o cofre certo: a senha nunca aparece no código, quem lê é a identidade do sistema, e cada leitura fica registrada. Era exatamente o que faltava no incidente." },
        { texto: "Manda no grupo do WhatsApp da equipe, que é rapidinho.", efeito: { dados: -35, clinica: 0, pistas: 0 }, certo: false,
          porque: "Senha em grupo de mensagem vira print, encaminhamento e celular perdido. Rápido e inseguro." },
      ],
    },
    {
      nome: "Monitoramento",
      ico: "📡",
      alerta: "14h30 · Tudo funcionando. A diretora pergunta: \"E como a gente sabe se eles tentarem de novo?\"",
      pergunta: "O que você coloca de vigia?",
      opcoes: [
        { texto: "Ligar o Sentinel com alertas para acesso público, login de madrugada e papel de Proprietário novo.", efeito: { dados: 0, clinica: 0, pistas: 15 }, certo: true,
          porque: "Lembra da conversa no bar? \"Só se ligarem o Sentinel.\" Agora cada passo estranho vira alerta na hora, e os logs ficam guardados como pista." },
        { texto: "Alguém olha os logs manualmente uma vez por mês.", efeito: { dados: -15, clinica: 0, pistas: 0 }, certo: false,
          porque: "Um mês é muito tempo: o ataque de hoje levou uma noite. Olhar log é bom, mas o alarme tem que tocar sozinho." },
        { texto: "Não precisa: agora que fechamos tudo, não acontece de novo.", efeito: { dados: -25, clinica: 0, pistas: 0 }, certo: false,
          porque: "Atacante que entrou uma vez volta para testar. Sem vigia, você só descobre pelo jornal." },
      ],
    },
    {
      nome: "Lições aprendidas",
      ico: "📝",
      alerta: "No dia seguinte · As fichas eram dados de saúde de pacientes. A diretora está preocupada com a imagem da clínica.",
      pergunta: "Como você fecha o incidente?",
      opcoes: [
        { texto: "Não contar para ninguém, para não manchar a imagem da clínica.", efeito: { dados: -10, clinica: -20, pistas: 0 }, certo: false,
          porque: "Esconder é o pior caminho: a LGPD manda comunicar à ANPD e aos pacientes quando o incidente pode causar risco ou dano relevante (art. 48). Dado de saúde é dado sensível. Esconder vira multa e perda de confiança." },
        { texto: "Demitir o estagiário que subiu o código com a senha.", efeito: { dados: 0, clinica: -15, pistas: 0 }, certo: false,
          porque: "Caçar culpado não conserta o processo: amanhã outra pessoa comete o mesmo erro. Na reunião de lições aprendidas, a pergunta é \"o que a gente muda?\", não \"quem a gente pune?\"." },
        { texto: "Registrar o incidente, comunicar a ANPD e os pacientes como a LGPD pede e fazer a reunião de lições aprendidas.", efeito: { dados: 0, clinica: 5, pistas: 10 }, certo: true,
          porque: "Transparência e melhoria: o incidente vira aprendizado (revisão de código antes de publicar, Key Vault obrigatório, alerta para acesso público). A clínica sai mais forte." },
      ],
    },
  ];

  // ---------- desenho ----------
  function desenharFases() {
    $("[data-fases]").innerHTML = FASES.map((f, i) =>
      `<li class="${i < fase ? "feita" : i === fase ? "agora" : ""}"><span aria-hidden="true">${f.ico}</span>${f.nome}</li>`).join("");
  }

  function desenharMedidores() {
    Object.entries(medidores).forEach(([chave, valor]) => {
      const m = $(`[data-medidor="${chave}"]`);
      const v = Math.max(0, Math.min(100, valor));
      m.querySelector("i").style.width = v + "%";
      m.querySelector("b").textContent = v;
      m.classList.toggle("baixo", v < 50);
      m.classList.toggle("medio", v >= 50 && v < 80);
    });
  }

  function briefing() {
    fase = -1;
    Object.assign(medidores, { dados: 100, clinica: 100, pistas: 100 });
    acertos = 0;
    desenharFases();
    desenharMedidores();
    $("[data-cena]").innerHTML = `
      <p class="co-hora">📞 Ligação da Central · 08h00</p>
      <p class="co-texto">Agente, parabéns pela credencial. Mas temos um problema: a conversa do bar não era papo furado. Os invasores ainda têm acesso à nuvem da clínica Bem Cuidar.</p>
      <p class="co-texto">Você vai liderar a <b>resposta ao incidente</b>, fase por fase: conter, erradicar, recuperar, monitorar e aprender. Fique de olho nos três medidores.</p>
      <button type="button" class="botao" data-comecar>Assumir a sala de crise →</button>`;
  }

  function mostrarFase() {
    const f = FASES[fase];
    desenharFases();
    const opcoes = f.opcoes.map((o, i) => ({ o, i })).sort(() => Math.random() - 0.5);
    $("[data-cena]").innerHTML = `
      <p class="co-hora">${f.ico} Fase ${fase + 1} de ${FASES.length} · ${f.nome}</p>
      <p class="co-alerta">${f.alerta}</p>
      <h3>${f.pergunta}</h3>
      <div class="co-opcoes">${opcoes.map(({ o, i }) => `<button type="button" data-opcao="${i}">${o.texto}</button>`).join("")}</div>`;
    const primeira = $("[data-opcao]");
    if (primeira) primeira.focus({ preventScroll: true });
  }

  function escolher(i) {
    const f = FASES[fase];
    const o = f.opcoes[i];
    if (o.certo) acertos++;
    Object.entries(o.efeito).forEach(([k, v]) => { medidores[k] += v; });
    desenharMedidores();
    document.querySelectorAll("[data-opcao]").forEach((b) => {
      b.disabled = true;
      const op = f.opcoes[Number(b.dataset.opcao)];
      if (op.certo) b.classList.add("certa");
      if (Number(b.dataset.opcao) === i && !o.certo) b.classList.add("errada");
    });
    const mudancas = Object.entries(o.efeito).filter(([, v]) => v !== 0)
      .map(([k, v]) => `<span class="${v > 0 ? "sobe" : "desce"}">${{ dados: "🗂️ fichas", clinica: "🏥 clínica", pistas: "🔎 pistas" }[k]} ${v > 0 ? "+" : ""}${v}</span>`).join(" ");
    const ultima = fase === FASES.length - 1;
    const retorno = document.createElement("div");
    retorno.className = "co-retorno " + (o.certo ? "bom" : "ruim");
    retorno.innerHTML = `
      <p class="co-carimbo">${o.certo ? "✔ DECISÃO CERTEIRA" : "✘ DECISÃO ARRISCADA"}</p>
      <p>${o.porque}</p>
      ${mudancas ? `<p class="co-mudancas">${mudancas}</p>` : ""}
      <button type="button" class="botao" data-seguir>${ultima ? "Ver o relatório final →" : "Próxima fase →"}</button>`;
    $("[data-cena]").appendChild(retorno);
    $("[data-seguir]").focus({ preventScroll: true });
    retorno.scrollIntoView({ behavior: parado() ? "auto" : "smooth", block: "nearest" });
  }

  function relatorio() {
    fase = FASES.length;
    desenharFases();
    const media = Math.round((Math.max(0, medidores.dados) + Math.max(0, medidores.clinica) + Math.min(100, Math.max(0, medidores.pistas))) / 3);
    const patente = acertos === 5 ? ["🏅 Agente Sênior da Nuvem", "Resposta perfeita: você conteve, erradicou, recuperou, vigiou e aprendeu."]
      : acertos >= 3 ? ["🎖️ Agente de Campo", "Boa resposta, com alguns tropeços. Releia as decisões arriscadas e jogue de novo."]
      : ["🔰 Agente em Treinamento", "Curto-circuito faz parte. Volte nas explicações e tente de novo: no Stela Cloud, isso vai valer nota."];
    $("[data-cena]").innerHTML = `
      <p class="co-hora">📋 Relatório do incidente</p>
      <p class="co-patente">${patente[0]}</p>
      <p class="co-texto">${patente[1]}</p>
      <ul class="co-resumo">
        <li><b>${acertos} de ${FASES.length}</b> decisões certeiras</li>
        <li>Saúde final da clínica: <b>${media}%</b></li>
      </ul>
      <p class="co-texto">As fases que você acabou de viver são as mesmas da aula 14, e são o raciocínio do plantão no <b>Stela Cloud</b>, na semana que vem.</p>
      <p class="co-acoes"><button type="button" class="botao" data-de-novo>Jogar de novo</button> <a class="botao contorno" href="../../aulas/aula-14.html">Rever a aula 14</a></p>`;
  }

  // ---------- eventos ----------
  $("[data-cena]").addEventListener("click", (e) => {
    if (e.target.closest("[data-comecar]")) { fase = 0; return mostrarFase(); }
    const op = e.target.closest("[data-opcao]");
    if (op && !op.disabled) return escolher(Number(op.dataset.opcao));
    if (e.target.closest("[data-seguir]")) {
      fase++;
      return fase >= FASES.length ? relatorio() : mostrarFase();
    }
    if (e.target.closest("[data-de-novo]")) return briefing();
  });

  // ---------- a trava: a Parte 2 só abre para quem concluiu a Parte 1 ----------
  // A entrega do escape room só é registrada com o código certo da credencial (que aparece no fim da missão).
  async function conferirCredencial() {
    const texto = $("[data-trava-texto]");
    const acoes = $("[data-trava-acoes]");
    const abrir = (sim) => { $("[data-trava]").hidden = sim; $("[data-jogo]").hidden = !sim; };
    if (!window.CONTA || !CONTA.usuario || !CONTA.usuario()) {
      abrir(false);
      texto.innerHTML = "Entre com o e-mail da faculdade (<b>@edu.df.senac.br</b>), no botão <b>Entrar</b>, lá em cima.";
      acoes.innerHTML = '<button type="button" class="botao" data-entrar>Entrar</button>';
      return;
    }
    texto.textContent = "Conferindo a sua credencial...";
    acoes.innerHTML = "";
    const nuvem = CONTA.cliente && CONTA.cliente();
    let ok = false;
    if (nuvem) {
      const { data, error } = await nuvem.from("disc_tentativas").select("id")
        .eq("aluno_id", CONTA.usuario().id).eq("atividade", "agente-secreto").gte("acertos", 1).limit(1);
      ok = !error && data && data.length > 0;
    }
    if (ok) {
      if ($("[data-jogo]").hidden) { abrir(true); briefing(); }
      return;
    }
    abrir(false);
    texto.innerHTML = "Esta missão é só para quem já é <b>Agente da Nuvem</b>. Termine o escape room da Parte 1, abra a maleta e entregue o código da credencial. Depois volte aqui.";
    acoes.innerHTML = '<a class="botao" href="../#jogo">Ir para a Parte 1 →</a> <button type="button" class="botao contorno" data-conferir>Já entreguei: conferir de novo</button>';
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-entrar]") && window.CONTA) CONTA.abrir();
    if (e.target.closest("[data-conferir]")) conferirCredencial();
  });
  if (window.CONTA && CONTA.aoMudar) CONTA.aoMudar(conferirCredencial);
  conferirCredencial();
})();
