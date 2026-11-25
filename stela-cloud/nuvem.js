/* ===================================================================
   nuvem.js: o motor da tela do Stela Cloud · versão 3 · 2026-11-16 (o mundo vem de window.STELA_MUNDO: o Stela Infra usa o mesmo motor; texto sem espaços nas pontas; aviso de abertura do mundo)
   Entrada (login + código da sala), crachá, briefing, portal (barra de comando, cronômetro,
   menu dos serviços, fila de incidentes), lâminas que deslizam da direita e o relatório de pós-incidente.
   Quem decide a nota é o banco (funções sc_..., Placa-Mae/supabase/stela-cloud.sql):
   aqui só se mostra a tela e se chama sc_entrar, sc_salvar, sc_registrar e sc_finalizar.
   As telas de cada recurso vêm da missão (campo "telas"): o motor não sabe nada de nenhuma missão.
   Demonstração sem login: index.html?demo
   =================================================================== */
(function () {
  "use strict";

  // o mundo da página (Stela Cloud por padrão; o Stela Infra define window.STELA_MUNDO antes deste arquivo)
  const MUNDO = window.STELA_MUNDO || {};
  const REAL = MUNDO.rotuloReal || "no Azure";
  // os 8 serviços: nome do Stela Cloud, o equivalente no Azure e o que se configura
  const SERVICOS = MUNDO.servicos || [
    { id: "identity", nome: "Stela Identity", azure: "Microsoft Entra ID", faz: "usuários, convidados, MFA, acesso condicional e logs de entrada" },
    { id: "access", nome: "Stela Access Control", azure: "Azure RBAC (IAM)", faz: "papéis (Owner, Contributor, Reader) e o escopo de cada um" },
    { id: "storage", nome: "Stela Storage", azure: "Storage Account / Blob Storage", faz: "acesso anônimo, HTTPS, TLS mínimo, rede e exclusão reversível" },
    { id: "network", nome: "Stela Network Guard", azure: "Network Security Group (NSG)", faz: "regras de entrada e saída, portas, origens e prioridades" },
    { id: "vault", nome: "Stela Vault", azure: "Azure Key Vault", faz: "segredos, chaves e proteção contra exclusão" },
    { id: "compute", nome: "Stela Compute", azure: "Máquinas virtuais", faz: "IP público, RDP e SSH, criptografia de disco e backup" },
    { id: "defender", nome: "Stela Defender", azure: "Microsoft Defender for Cloud", faz: "secure score, recomendações e planos de proteção" },
    { id: "monitor", nome: "Stela Monitor", azure: "Azure Monitor / Log Analytics", faz: "logs de atividade, alertas e diagnósticos" }
  ];
  // "Stela Identity + Access Control" fica no primeiro serviço citado
  function servicoDa(missao) {
    const texto = String(missao.servico || "").toLowerCase();
    return SERVICOS.find(function (s) { return texto.indexOf(s.nome.toLowerCase()) === 0; })
      || SERVICOS.find(function (s) { return texto.indexOf(s.nome.toLowerCase().replace("stela ", "")) >= 0; })
      || SERVICOS[0];
  }
  const CONQUISTAS = [
    { nome: "Zero Trust", explica: "todas as identidades corrigidas" },
    { nome: "Produção de Pé", explica: "nenhuma ação derrubou o cliente" },
    { nome: "Relâmpago", explica: "terminou com 10 minutos sobrando" },
    { nome: "Detetive", explica: "abriu os logs antes de mexer, em todas as missões" }
  ];

  // notificações de plantão: humor, sem efeito nenhum
  const PIADAS = MUNDO.piadas || [
    "O café da sala de servidores acabou.",
    "Alguém deixou um pendrive sem nome na recepção. Ninguém vai plugar, né?",
    "Lembrete do RH: hoje é aniversário do servidor de laudos. 7 anos sem reiniciar.",
    "O estagiário perguntou se pode \"só testar uma coisinha\" na produção.",
    "Previsão do tempo: 100% de chance de nuvem."
  ];

  const $ = function (id) { return document.getElementById(id); };
  const demo = new URLSearchParams(location.search).has("demo");
  let cenario = null;
  let fimDoTempo = null;      // performance.now() em que o tempo acaba (null: sem cronômetro)
  let encerrado = false;
  let relogio = null;
  const avisados = {};

  // guardar no navegador (sem quebrar se o navegador não deixar)
  function guardar(chave, valor) { try { localStorage.setItem("stela-cloud:" + chave, valor); } catch (e) { /* tudo bem */ } }
  function ler(chave) { try { return localStorage.getItem("stela-cloud:" + chave); } catch (e) { return null; } }
  function apagar(chave) { try { localStorage.removeItem("stela-cloud:" + chave); } catch (e) { /* tudo bem */ } }

  function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }
  function icone(id, classe) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    if (classe) svg.setAttribute("class", classe);
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#ic-" + id);
    svg.appendChild(use);
    return svg;
  }
  function anunciar(texto) {
    const a = $("anuncio");
    a.textContent = "";
    setTimeout(function () { a.textContent = texto; }, 50);
  }
  function cliente() { return window.CONTA && CONTA.cliente ? CONTA.cliente() : null; }
  function clonar(o) { return JSON.parse(JSON.stringify(o === undefined ? {} : o)); }
  function hora(iso) { return new Date(iso || Date.now()).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); }

  // textos com o cliente do aluno: {cliente}, {arquivos}, {quem}, {pessoa}, {portal}; {x:min} começa minúsculo
  function txt(s) {
    const c = (cenario && cenario.cliente) || { nome: "o cliente", textos: {} };
    const t = Object.assign({ cliente: c.nome }, c.textos || {});
    return String(s == null ? "" : s).replace(/\{(\w+)(:min)?\}/g, function (todo, k, min) {
      if (t[k] === undefined) return todo;
      return min ? t[k].charAt(0).toLocaleLowerCase("pt-BR") + t[k].slice(1) : t[k];
    });
  }

  // ===================== TELA 1: ENTRADA =====================
  const msg = $("msg-entrada");
  function aviso(texto, tipo) {
    msg.textContent = texto;
    msg.className = "sc-msg" + (tipo ? " " + tipo : "");
  }
  function logado() { return window.CONTA && CONTA.daFaculdade && CONTA.daFaculdade(); }

  function atualizarEntrada() {
    const ok = logado();
    $("passo-login").classList.toggle("feito", Boolean(ok));
    $("passo-codigo").classList.toggle("bloqueado", !ok);
    $("btn-entrar").hidden = Boolean(ok);
    $("quem").textContent = ok
      ? "Você entrou como " + (CONTA.nome() || CONTA.usuario().email) + "."
      : "O mesmo login dos sites das disciplinas (@edu.df.senac.br).";
  }

  $("btn-entrar").addEventListener("click", function () {
    if (window.CONTA && CONTA.abrir) CONTA.abrir();
  });
  if (window.CONTA && CONTA.aoMudar) CONTA.aoMudar(atualizarEntrada);
  const ultimoCodigo = ler("codigo");
  if (ultimoCodigo) $("codigo").value = ultimoCodigo;

  $("form-codigo").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const codigo = $("codigo").value.trim().toUpperCase();
    if (!logado()) {
      aviso("Primeiro entre com o e-mail da faculdade (passo 1).", "erro");
      $("btn-entrar").focus();
      return;
    }
    if (!/^[A-Z0-9]{4,8}$/.test(codigo)) {
      aviso("O código tem de 4 a 8 letras e números. Confira com a professora.", "erro");
      $("codigo").focus();
      return;
    }
    aviso("Soldando os componentes... conectando ao plantão.");
    const { data, error } = await cliente().rpc("sc_entrar", { p_codigo: codigo });
    if (error) {
      aviso(error.message || "Curto-circuito. Tente de novo em instantes.", "erro");
      return;
    }
    guardar("codigo", codigo);
    aviso("");
    iniciarPortal(data);
  });

  // ===================== TELA 2: O PORTAL =====================
  function iniciarPortal(c) {
    cenario = c;
    $("entrada").hidden = true;
    $("portal").hidden = false;
    document.title = "Plantão · " + (MUNDO.marca || "Stela Cloud");
    document.querySelectorAll("#menu a").forEach(function (a) { a.hidden = true; });
    montarCracha();
    if (c.finalizada) {
      mostrarRelatorio(c);
      return;
    }
    montarLateral();
    montarFila();
    iniciarRelogio(c.segundos_restantes);
    agendarPiadas();
    // crachá e briefing só na primeira vez de cada tentativa
    const chave = "visto:" + (demo ? "demo" : c.tentativa);
    if (!ler(chave)) {
      guardar(chave, "1");
      const dlg = $("dlg-cracha");
      dlg.addEventListener("close", function () { abrirBriefing(); }, { once: true });
      dlg.showModal();
    } else {
      $("principal").focus();
    }
  }

  function nomeDoAnalista() {
    if (demo) return "Analista de Demonstração";
    return (window.CONTA && CONTA.nome && CONTA.nome()) || "Analista";
  }
  function montarCracha() {
    const nome = nomeDoAnalista();
    const inicial = nome.trim().charAt(0).toUpperCase() || "?";
    const cli = cenario.cliente || { nome: "StelaCore Systems", textos: {} };
    $("cracha-nome").textContent = nome.split(" ")[0];
    $("cracha-inicial").textContent = inicial;
    $("cracha-titulo").textContent = nome;
    $("cracha-foto").textContent = (cli.textos && cli.textos.icone) || inicial;
    $("cracha-email").textContent = demo ? "demonstracao@edu.df.senac.br" : ((CONTA.usuario() || {}).email || "—");
    $("cracha-cliente").textContent = cli.nome;
    $("cracha-plantao").textContent = (cenario.sala.treino ? "Treino" : cenario.sala.titulo) + " · tentativa " + cenario.numero;
    $("fila-cliente").textContent = "cliente · " + cli.nome;
  }
  $("btn-cracha").addEventListener("click", function () { $("dlg-cracha").showModal(); });

  function abrirBriefing() {
    const n = cenario.missoes.length;
    const min = cenario.sala.duracao_min;
    if (MUNDO.briefing) {
      // o mundo pode ter o seu próprio aviso de abertura (ex.: montar a nuvem do Ateliê em vez de apagar incêndio)
      const b = MUNDO.briefing(n, cenario.cliente, min);
      $("briefing-titulo").textContent = b[0];
      $("briefing-texto").textContent = b[1];
    } else {
      $("briefing-titulo").textContent = n + (n > 1 ? " incidentes críticos" : " incidente crítico") + " na produção.";
      $("briefing-texto").textContent = (cenario.cliente ? cenario.cliente.nome + " está em pânico. " : "")
        + (min ? "O CEO quer o relatório em " + min + " minutos. " : "O CEO quer o relatório até o prazo. ")
        + "Corrija sem derrubar a produção: analista que derruba o cliente também vira incidente.";
    }
    const dlg = $("dlg-briefing");
    dlg.addEventListener("close", function () { $("principal").focus(); }, { once: true });
    dlg.showModal();
  }

  // ---------- menu lateral dos serviços ----------
  function missoesDo(servico) {
    return cenario.missoes.filter(function (m) { return servicoDa(m).id === servico.id; });
  }
  function montarLateral() {
    const ul = $("lista-servicos");
    ul.textContent = "";
    SERVICOS.forEach(function (s) {
      const li = el("li");
      const b = el("button", "sc-servico");
      b.type = "button";
      b.dataset.servico = s.id;
      b.style.setProperty("--cor", "var(--c-" + s.id + ")");
      const ic = el("span", "sc-servico-icone");
      ic.appendChild(icone(s.id));
      const nome = el("span", "sc-servico-nome", s.nome);
      nome.appendChild(el("span", "sc-servico-azure", REAL + ": " + s.azure));
      const n = missoesDo(s).length;
      if (n) nome.appendChild(el("span", "sc-alerta-n", "⚠ " + n + (n > 1 ? " incidentes" : " incidente")));
      b.append(ic, nome);
      b.addEventListener("click", function () { fecharLateral(); abrirServico(s, b); });
      li.appendChild(b);
      ul.appendChild(li);
    });
  }
  function fecharLateral() {
    $("lateral").classList.remove("aberta");
    $("btn-lateral").setAttribute("aria-expanded", "false");
  }
  // no celular: tocar fora da gaveta fecha
  document.addEventListener("click", function (ev) {
    if ($("lateral").classList.contains("aberta") && !ev.target.closest("#lateral, #btn-lateral")) fecharLateral();
  });
  $("btn-lateral").addEventListener("click", function () {
    const aberta = $("lateral").classList.toggle("aberta");
    this.setAttribute("aria-expanded", String(aberta));
    if (aberta) $("lateral").querySelector("button").focus();
  });

  // ---------- fila de incidentes ----------
  function chaveResolvido(m) { return "resolvido:" + (demo ? "demo" : cenario.tentativa) + ":" + m.id; }
  function situacao(m) {
    if (ler(chaveResolvido(m))) return "resolvido";
    return m.salvo && Object.keys(m.salvo).length ? "andamento" : "aberto";
  }
  const ROTULO = { aberto: "Aberto", andamento: "Em andamento", resolvido: "Resolvido por você" };
  const ICONE_SITUACAO = { aberto: "alerta", andamento: "andamento", resolvido: "feito" };

  function montarFila() {
    const ul = $("fila");
    ul.textContent = "";
    const conta = { aberto: 0, andamento: 0, resolvido: 0 };
    cenario.missoes.forEach(function (m) {
      const s = servicoDa(m);
      const sit = situacao(m);
      conta[sit]++;
      const li = el("li");
      li.dataset.busca = (txt(m.titulo) + " " + s.nome + " " + s.azure).toLowerCase();
      const b = el("button", "sc-chamado");
      b.type = "button";
      b.style.setProperty("--cor", "var(--c-" + s.id + ")");
      const topo = el("span", "sc-chamado-topo");
      topo.append(icone(s.id), el("span", "", s.nome), el("span", "sc-prioridade", (m.chamado && m.chamado.prioridade) || "P1"));
      const h = el("h2", "", txt(m.titulo));
      const frase = el("blockquote", "", "“" + txt((m.chamado && m.chamado.frase) || m.briefing || "") + "”");
      const st = el("span", "sc-status " + sit);
      st.append(icone(ICONE_SITUACAO[sit]), el("span", "", ROTULO[sit]));
      b.append(topo, h, frase, st);
      b.addEventListener("click", function () { abrirChamado(m, b); });
      li.appendChild(b);
      ul.appendChild(li);
    });
    $("fila-resumo").textContent = conta.aberto + " aberto(s) · " + conta.andamento + " em andamento · " + conta.resolvido + " resolvido(s)";
  }

  // ---------- busca: filtra os serviços e a fila ----------
  $("busca").addEventListener("input", function () {
    const t = this.value.trim().toLowerCase();
    document.querySelectorAll("#lista-servicos .sc-servico").forEach(function (b) {
      b.parentElement.classList.toggle("sc-oculto", Boolean(t) && b.textContent.toLowerCase().indexOf(t) < 0);
    });
    document.querySelectorAll("#fila li").forEach(function (li) {
      li.classList.toggle("sc-oculto", Boolean(t) && li.dataset.busca.indexOf(t) < 0);
    });
  });

  // ===================== LÂMINAS =====================
  const pilha = []; // { lamina, volta: elemento que abriu, titulo, antesDeFechar }
  function travarFundo(travar) {
    [document.querySelector(".barra"), document.querySelector(".sc-comando"), document.querySelector(".sc-corpo")].forEach(function (e) {
      if (e) e.inert = travar;
    });
  }
  // abre uma lâmina por cima das outras. op: { titulo, sub, servico, montar(corpo, lamina, registro) }
  function abrirLamina(op, volta) {
    const lamina = el("section", "sc-lamina");
    lamina.setAttribute("role", "dialog");
    lamina.setAttribute("aria-modal", "true");
    if (op.servico) lamina.style.setProperty("--cor", "var(--c-" + op.servico.id + ")");
    const topo = el("div", "sc-lamina-topo");
    const mig = el("p", "sc-migalhas");
    const inicio = el("button", "", "Plantão");
    inicio.type = "button";
    inicio.addEventListener("click", function () { fecharTodas(); });
    mig.appendChild(inicio);
    pilha.forEach(function (p, i) {
      mig.appendChild(el("span", "", "›"));
      const b = el("button", "", p.titulo);
      b.type = "button";
      b.addEventListener("click", function () { while (pilha.length > i + 1) { if (!fecharLamina()) break; } });
      mig.appendChild(b);
    });
    const linha = el("div", "sc-lamina-titulo");
    if (op.servico) {
      const ic = el("span", "sc-servico-icone");
      ic.style.setProperty("--cor", "var(--c-" + op.servico.id + ")");
      ic.appendChild(icone(op.servico.id));
      linha.appendChild(ic);
    }
    const h = el("h2", "", op.titulo);
    h.tabIndex = -1;
    h.id = "lamina-" + Date.now();
    lamina.setAttribute("aria-labelledby", h.id);
    const fechar = el("button", "sc-fechar");
    fechar.type = "button";
    fechar.setAttribute("aria-label", "Fechar " + op.titulo);
    fechar.appendChild(icone("fechar"));
    fechar.addEventListener("click", function () { fecharLamina(); });
    linha.append(h, fechar);
    topo.append(mig, linha);
    if (op.sub) topo.appendChild(el("p", "sc-lamina-sub", op.sub));
    const corpo = el("div", "sc-lamina-corpo");
    const registro = { lamina: lamina, volta: volta || document.activeElement, titulo: op.titulo, antesDeFechar: null };
    op.montar(corpo, lamina, registro);
    lamina.append(topo, corpo);

    if (pilha.length) pilha[pilha.length - 1].lamina.inert = true;
    pilha.push(registro);
    $("laminas").appendChild(lamina);
    travarFundo(true);
    h.focus();
  }
  // fecha a de cima; devolve false se a pessoa desistiu (alterações não salvas)
  function fecharLamina(forcar) {
    const topo = pilha[pilha.length - 1];
    if (!topo) return false;
    if (!forcar && topo.antesDeFechar && !topo.antesDeFechar()) return false;
    pilha.pop();
    topo.lamina.remove();
    if (pilha.length) pilha[pilha.length - 1].lamina.inert = false;
    else travarFundo(false);
    if (topo.volta && document.contains(topo.volta)) topo.volta.focus();
    return true;
  }
  function fecharTodas(forcar) { while (pilha.length) { if (!fecharLamina(forcar)) break; } }
  // clicar fora da lâmina (no escuro) fecha a de cima
  $("laminas").addEventListener("click", function (ev) { if (ev.target === this) fecharLamina(); });

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape") return;
    if (document.querySelector("dialog[open]")) return; // o diálogo cuida do Esc
    if (pilha.length) { ev.preventDefault(); fecharLamina(); return; }
    if ($("lateral").classList.contains("aberta")) { fecharLateral(); $("btn-lateral").focus(); return; }
    if (!$("notificacoes").hidden) { fecharSino(); }
  });

  // ---------- o que cada lâmina mostra ----------
  function equivale(corpo, s) {
    const box = el("p", "sc-equivale");
    box.appendChild(icone(s.id));
    const t = el("span");
    t.append(MUNDO.fraseReal || "No Azure de verdade, isto é o ", el("strong", "", s.azure), ": " + s.faz + ".");
    box.appendChild(t);
    corpo.appendChild(box);
  }
  function nomeDoRecurso(m, r) {
    const tela = (m.telas || {})[r] || {};
    const estado = (m.estado_inicial || {})[r] || {};
    if (tela.tipo === "logs") return (tela.titulo || "Logs") + " · " + txt(m.titulo);
    return estado._nome || r;
  }
  function listaDeRecursos(corpo, s, missoes) {
    const ul = el("ul", "sc-recursos");
    missoes.forEach(function (m) {
      Object.keys(m.estado_inicial || {}).forEach(function (r) {
        const tela = (m.telas || {})[r] || {};
        const ehLog = tela.tipo === "logs" || r === "logs";
        const li = el("li");
        const b = el("button", "sc-recurso");
        b.type = "button";
        b.style.setProperty("--cor", "var(--c-" + s.id + ")");
        const salvo = m.salvo && m.salvo[r];
        const excluido = salvo && salvo.excluida;
        b.append(icone(ehLog ? "monitor" : s.id), el("code", "", nomeDoRecurso(m, r)),
                 el("small", "", excluido ? "excluído" : salvo ? "salvo às " + (salvo._salvo_as || "") : ehLog ? "investigar" : "configurar"));
        b.addEventListener("click", function () { abrirRecurso(m, s, r, b); });
        li.appendChild(b);
        ul.appendChild(li);
      });
    });
    corpo.appendChild(ul);
  }
  function abrirServico(s, volta) {
    document.querySelectorAll(".sc-servico").forEach(function (b) { b.setAttribute("aria-current", String(b.dataset.servico === s.id)); });
    const missoes = missoesDo(s);
    abrirLamina({
      titulo: s.nome, sub: REAL + ": " + s.azure, servico: s,
      montar: function (corpo) {
        equivale(corpo, s);
        if (!missoes.length) {
          corpo.appendChild(el("p", "", "Nenhum incidente aberto neste serviço. Por aqui, tudo calmo... por enquanto."));
          return;
        }
        corpo.appendChild(el("h3", "", "Recursos com incidente"));
        listaDeRecursos(corpo, s, missoes);
      }
    }, volta);
  }
  function abrirChamado(m, volta) {
    const s = servicoDa(m);
    abrirLamina({
      titulo: txt(m.titulo), sub: s.nome + " · prioridade " + ((m.chamado && m.chamado.prioridade) || "P1"), servico: s,
      montar: function (corpo) {
        if (m.chamado && m.chamado.frase) {
          corpo.appendChild(el("h3", "", "Quem abriu o chamado disse"));
          corpo.appendChild(el("blockquote", "", "“" + txt(m.chamado.frase) + "”"));
        }
        if (m.chamado && m.chamado.sistema) corpo.appendChild(el("p", "", "Sistema afetado: " + txt(m.chamado.sistema) + "."));
        if (m.briefing) {
          corpo.appendChild(el("h3", "", "O que se sabe"));
          corpo.appendChild(el("p", "", txt(m.briefing)));
        }
        equivale(corpo, s);
        corpo.appendChild(el("h3", "", "Onde investigar e corrigir"));
        listaDeRecursos(corpo, s, [m]);
        const marcar = el("button", "botao contorno", situacao(m) === "resolvido" ? "Reabrir o chamado" : "Marcar como resolvido");
        marcar.type = "button";
        marcar.style.marginTop = "1.2rem";
        marcar.addEventListener("click", function () {
          if (situacao(m) === "resolvido") apagar(chaveResolvido(m));
          else guardar(chaveResolvido(m), "1");
          montarFila();
          fecharLamina();
          anunciar("Chamado " + (situacao(m) === "resolvido" ? "marcado como resolvido" : "reaberto") + ". A nota vem do que você salvou, não desta marca.");
        });
        corpo.appendChild(marcar);
      }
    }, volta);
  }
  function abrirRecurso(m, s, r, volta) {
    const tela = (m.telas || {})[r] || {};
    const ehLog = tela.tipo === "logs" || r === "logs";
    if (ehLog && !demo && cliente()) cliente().rpc("sc_registrar", { p_tentativa: cenario.tentativa, p_tipo: "abriu_log", p_missao: m.id });
    abrirLamina({
      titulo: ehLog ? txt(tela.titulo || "Logs") : nomeDoRecurso(m, r),
      sub: s.nome + " · " + txt(m.titulo), servico: s,
      montar: function (corpo, lamina, registro) {
        if (ehLog) montarLogs(corpo, m, r, tela);
        else if (tela.tipo === "config") montarPainel(corpo, lamina, registro, m, s, r, tela);
        else corpo.appendChild(el("p", "sc-em-breve", "Este recurso ainda não tem tela."));
      }
    }, volta);
  }

  // ===================== OS LOGS (o detetive) =====================
  function montarLogs(corpo, m, r, tela) {
    const linhas = (((m.estado_inicial || {})[r] || {}).linhas) || [];
    const colunas = tela.colunas || Object.keys(linhas[0] || {}).map(function (k) { return { chave: k, rotulo: k }; });
    corpo.appendChild(el("p", "sc-nota", "Leia como detetive: quem acessou, de onde, com qual programa e com ou sem login? Marque as linhas suspeitas para não se perder."));
    const filtro = el("label", "sc-busca sc-filtro");
    filtro.appendChild(icone("busca"));
    filtro.appendChild(el("span", "sr-only", "Filtrar os logs"));
    const campo = el("input");
    campo.type = "search";
    campo.placeholder = "Filtrar: IP, país, programa, protocolo...";
    filtro.appendChild(campo);
    corpo.appendChild(filtro);
    const resumo = el("p", "sc-nota sc-suspeitas", "Nenhuma linha marcada como suspeita.");
    resumo.setAttribute("aria-live", "polite");
    const caixa = el("div", "sc-tabela-caixa");
    caixa.tabIndex = 0;
    caixa.setAttribute("role", "region");
    caixa.setAttribute("aria-label", "Tabela de logs (role para os lados se precisar)");
    const tabela = el("table", "sc-logs");
    const thead = el("thead");
    const trh = el("tr");
    trh.appendChild(el("th", "", "Suspeita?"));
    colunas.forEach(function (c) { const th = el("th", "", c.rotulo); th.scope = "col"; trh.appendChild(th); });
    thead.appendChild(trh);
    const tbody = el("tbody");
    const chave = "suspeitas:" + (demo ? "demo" : cenario.tentativa) + ":" + m.id;
    let marcadas = [];
    try { marcadas = JSON.parse(ler(chave) || "[]"); } catch (e) { marcadas = []; }
    function contar() {
      resumo.textContent = marcadas.length
        ? marcadas.length + (marcadas.length > 1 ? " linhas marcadas" : " linha marcada") + " como suspeita. O que elas têm em comum?"
        : "Nenhuma linha marcada como suspeita.";
    }
    linhas.forEach(function (l, i) {
      const tr = el("tr");
      const td = el("td");
      const b = el("button", "sc-lupa");
      b.type = "button";
      const marcar = function (sim) {
        tr.classList.toggle("suspeita", sim);
        b.setAttribute("aria-pressed", String(sim));
        b.textContent = sim ? "🔎 suspeita" : "marcar";
      };
      b.setAttribute("aria-label", "Marcar a linha das " + (l.hora || i + 1) + " como suspeita");
      marcar(marcadas.indexOf(i) >= 0);
      b.addEventListener("click", function () {
        const sim = marcadas.indexOf(i) < 0;
        if (sim) marcadas.push(i); else marcadas = marcadas.filter(function (x) { return x !== i; });
        guardar(chave, JSON.stringify(marcadas));
        marcar(sim);
        contar();
      });
      td.appendChild(b);
      tr.appendChild(td);
      colunas.forEach(function (c) { tr.appendChild(el("td", "", txt(l[c.chave] == null ? "" : l[c.chave]))); });
      tr.dataset.busca = Object.values(l).join(" ").toLowerCase();
      tbody.appendChild(tr);
    });
    tabela.append(thead, tbody);
    caixa.appendChild(tabela);
    corpo.append(resumo, caixa);
    contar();
    campo.addEventListener("input", function () {
      const t = this.value.trim().toLowerCase();
      tbody.querySelectorAll("tr").forEach(function (tr) { tr.classList.toggle("sc-oculto", Boolean(t) && tr.dataset.busca.indexOf(t) < 0); });
    });
  }

  // ===================== O PAINEL DE CONFIGURAÇÃO =====================
  async function salvarNoBanco(m, r, valor) {
    // na demonstração não há gabarito; só a exclusão (óbvia) mostra como é a armadilha
    if (demo) return { salvo_em: new Date().toISOString(), reclamacao: valor.excluida ? "{pessoa}: \"O {portal} está fora do ar! Sumiu tudo!\"" : null };
    const { data, error } = await cliente().rpc("sc_salvar", { p_tentativa: cenario.tentativa, p_recurso: m.id + "/" + r, p_valor: valor });
    if (error) throw new Error(error.message || "Curto-circuito ao salvar. Tente de novo.");
    return data;
  }
  // depois de qualquer Salvar: guarda, atualiza a fila e reage à armadilha
  function depoisDeSalvar(m, r, valor, resposta) {
    if (resposta && resposta.encerrada) { encerrar(); return false; }
    valor._salvo_as = hora(resposta && resposta.salvo_em);
    m.salvo = m.salvo || {};
    m.salvo[r] = valor;
    montarFila();
    if (resposta && resposta.reclamacao) producaoCaiu(txt(resposta.reclamacao));
    return true;
  }

  function campoDeChave(campo, valor, mudou) {
    const rotulo = el("label", "sc-chave");
    const input = el("input");
    input.type = "checkbox";
    input.setAttribute("role", "switch");
    input.checked = Boolean(valor);
    input.addEventListener("change", function () { mudou(input.checked); estado.textContent = input.checked ? "Ligado" : "Desligado"; });
    const trilho = el("span", "sc-chave-trilho");
    trilho.setAttribute("aria-hidden", "true");
    const textos = el("span", "sc-chave-texto");
    textos.appendChild(el("span", "sc-campo-rotulo", txt(campo.rotulo)));
    if (campo.ajuda) textos.appendChild(el("span", "sc-campo-ajuda", txt(campo.ajuda)));
    const estado = el("span", "sc-chave-estado", input.checked ? "Ligado" : "Desligado");
    estado.setAttribute("aria-hidden", "true");
    rotulo.append(input, trilho, textos, estado);
    return rotulo;
  }
  function campoDeOpcoes(campo, valor, mudou, prefixo) {
    const grupo = el("fieldset", "sc-opcoes");
    grupo.appendChild(el("legend", "sc-campo-rotulo", txt(campo.rotulo)));
    if (campo.ajuda) grupo.appendChild(el("p", "sc-campo-ajuda", txt(campo.ajuda)));
    (campo.opcoes || []).forEach(function (o, i) {
      const op = typeof o === "object" ? o : { valor: o, rotulo: o };
      const lab = el("label", "sc-opcao");
      const input = el("input");
      input.type = "radio";
      input.name = prefixo + campo.chave;
      input.value = op.valor;
      input.checked = String(valor) === String(op.valor);
      input.addEventListener("change", function () { if (input.checked) mudou(op.valor); });
      lab.append(input, el("span", "", txt(op.rotulo)));
      grupo.appendChild(lab);
    });
    return grupo;
  }

  function montarPainel(corpo, lamina, registro, m, s, r, tela) {
    const prefixo = "c" + Date.now() + "-";
    const atual = clonar((m.salvo && m.salvo[r]) || m.estado_inicial[r]);
    delete atual._salvo_as;
    let rascunho = clonar(atual);

    if (atual.excluida) {
      const fim = el("div", "sc-excluido");
      fim.append(icone("alerta"), el("p", "", "Este recurso foi excluído. Não há mais o que configurar aqui."));
      corpo.appendChild(fim);
      return;
    }
    equivale(corpo, s);
    const quando = el("p", "sc-nota", m.salvo && m.salvo[r] ? "Último Salvar às " + m.salvo[r]._salvo_as + "." : "Ainda não salvo. Nada vale antes de clicar em Salvar.");
    corpo.appendChild(quando);

    const form = el("form", "sc-painel");
    form.noValidate = true;
    (tela.secoes || []).forEach(function (sec) {
      const bloco = el("section", "sc-secao");
      bloco.appendChild(el("h3", "", txt(sec.titulo)));
      (sec.campos || []).forEach(function (campo) {
        const mudou = function (novo) { rascunho[campo.chave] = novo; marcar(); };
        let peca;
        if (campo.tipo === "chave") peca = campoDeChave(campo, atual[campo.chave], mudou);
        else if (campo.tipo === "opcoes") peca = campoDeOpcoes(campo, atual[campo.chave], mudou, prefixo);
        else {
          peca = el("label", "sc-texto");
          peca.appendChild(el("span", "sc-campo-rotulo", txt(campo.rotulo)));
          const input = el("input");
          input.type = campo.tipo === "numero" ? "number" : "text";
          input.value = atual[campo.chave] == null ? "" : atual[campo.chave];
          input.addEventListener("input", function () { mudou(campo.tipo === "numero" ? Number(input.value) : input.value.trim()); });
          peca.appendChild(input);
        }
        peca.dataset.chave = campo.chave;
        bloco.appendChild(peca);
      });
      form.appendChild(bloco);
    });

    // a barra de salvar fica grudada embaixo
    const barra = el("div", "sc-salvar");
    const pendente = el("p", "sc-pendente", "");
    pendente.setAttribute("aria-live", "polite");
    const descartar = el("button", "botao contorno", "Descartar");
    descartar.type = "button";
    const salvar = el("button", "botao", "Salvar");
    salvar.type = "submit";
    barra.append(pendente, descartar, salvar);
    form.appendChild(barra);
    corpo.appendChild(form);

    function diferencas() {
      return Object.keys(rascunho).filter(function (k) { return JSON.stringify(rascunho[k]) !== JSON.stringify(atual[k]); });
    }
    function marcar() {
      const d = diferencas();
      form.querySelectorAll("[data-chave]").forEach(function (p) { p.classList.toggle("alterado", d.indexOf(p.dataset.chave) >= 0); });
      pendente.textContent = d.length ? d.length + (d.length > 1 ? " alterações não salvas" : " alteração não salva") : "Sem alterações.";
      salvar.disabled = !d.length;
      descartar.disabled = !d.length;
    }
    registro.antesDeFechar = function () {
      return !diferencas().length || window.confirm("Você tem alterações não salvas neste recurso. Sair sem salvar?");
    };
    descartar.addEventListener("click", function () {
      rascunho = clonar(atual);
      fecharLamina(true);
      abrirRecurso(m, s, r, registro.volta);
    });
    form.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      if (!diferencas().length) return;
      salvar.disabled = true;
      pendente.textContent = "Salvando...";
      try {
        const valor = clonar(rascunho);
        const resposta = await salvarNoBanco(m, r, valor);
        if (!depoisDeSalvar(m, r, valor, resposta)) return;
        Object.keys(atual).forEach(function (k) { delete atual[k]; });
        Object.assign(atual, clonar(valor));
        delete atual._salvo_as;
        quando.textContent = "Último Salvar às " + valor._salvo_as + ".";
        marcar();
        pendente.textContent = "Salvo às " + valor._salvo_as + ".";
        // o brilho de "fechei a brecha": não diz se a correção vale ponto
        lamina.classList.remove("salvou");
        void lamina.offsetWidth;
        lamina.classList.add("salvou");
        anunciar("Configuração salva.");
      } catch (e) {
        pendente.textContent = e.message;
        salvar.disabled = false;
      }
    });
    marcar();

    // zona de perigo: só com o nome digitado
    if (tela.perigo) {
      const nome = atual._nome || r;
      const zona = el("details", "sc-perigo");
      const sum = el("summary");
      sum.append(icone("alerta"), el("span", "", "Zona de perigo"));
      zona.appendChild(sum);
      zona.appendChild(el("p", "", txt(tela.perigo.aviso || "")));
      const lab = el("label", "sc-texto");
      lab.appendChild(el("span", "sc-campo-rotulo", "Para confirmar, digite o nome: " + nome));
      const conf = el("input");
      conf.autocomplete = "off";
      conf.spellcheck = false;
      lab.appendChild(conf);
      const apagarBtn = el("button", "botao sc-botao-perigo", txt(tela.perigo.rotulo));
      apagarBtn.type = "button";
      apagarBtn.disabled = true;
      conf.addEventListener("input", function () { apagarBtn.disabled = conf.value.trim() !== nome; });
      apagarBtn.addEventListener("click", async function () {
        apagarBtn.disabled = true;
        try {
          const valor = Object.assign(clonar(atual), { [tela.perigo.chave]: true });
          const resposta = await salvarNoBanco(m, r, valor);
          if (!depoisDeSalvar(m, r, valor, resposta)) return;
          fecharLamina(true);
        } catch (e) {
          anunciar(e.message);
          apagarBtn.disabled = false;
        }
      });
      zona.append(lab, apagarBtn);
      corpo.appendChild(zona);
    }
  }

  // a armadilha: a tela pisca em vermelho e o cliente liga reclamando
  function producaoCaiu(texto) {
    const flash = el("div", "sc-flash");
    flash.setAttribute("aria-hidden", "true");
    document.body.appendChild(flash);
    setTimeout(function () { flash.remove(); }, 1300);
    texto = texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1);   // "a enfermeira..." começa a frase
    $("reclamacao-texto").textContent = texto;
    notificar("📞 " + texto);
    $("dlg-reclamacao").showModal();
  }

  // ===================== CRONÔMETRO =====================
  function iniciarRelogio(segundos) {
    const r = $("relogio");
    if (segundos === null || segundos === undefined) {
      r.classList.add("sem");
      $("relogio-texto").textContent = "sem relógio";
      return;
    }
    fimDoTempo = performance.now() + segundos * 1000;
    tique();
    relogio = setInterval(tique, 250);
  }
  function tique() {
    if (fimDoTempo === null || encerrado) return;
    const falta = Math.max(0, Math.round((fimDoTempo - performance.now()) / 1000));
    const mm = String(Math.floor(falta / 60)).padStart(2, "0");
    const ss = String(falta % 60).padStart(2, "0");
    $("relogio-texto").textContent = mm + ":" + ss;
    const r = $("relogio");
    r.classList.toggle("amarelo", falta <= 600 && falta > 180);
    r.classList.toggle("vermelho", falta <= 180);
    r.setAttribute("aria-label", "Tempo restante: " + Math.floor(falta / 60) + " minutos e " + (falta % 60) + " segundos");
    [[600, "Faltam 10 minutos de plantão."], [180, "Faltam 3 minutos! Salve o que já corrigiu."], [60, "Último minuto!"]].forEach(function (a) {
      if (falta <= a[0] && !avisados[a[0]]) { avisados[a[0]] = true; anunciar(a[1]); }
    });
    if (falta === 0) encerrar();
  }

  // ===================== FIM DO PLANTÃO =====================
  $("btn-finalizar").addEventListener("click", function () { $("dlg-finalizar").showModal(); });
  $("dlg-finalizar").addEventListener("close", function () {
    if (this.returnValue === "sim") encerrar("Você finalizou o plantão. Gerando o relatório...");
  });

  async function encerrar(texto) {
    if (encerrado) return;
    encerrado = true;
    if (relogio) clearInterval(relogio);
    fecharTodas(true);
    document.querySelectorAll("dialog[open]").forEach(function (d) { d.close(); });
    $("encerrado-texto").textContent = texto || "O próximo turno assume daqui. O que você salvou foi registrado.";
    $("encerrado").hidden = false;
    travarFundo(true);
    $("encerrado").querySelector("[role=alertdialog]").focus();
    let resultado;
    if (demo) {
      resultado = Object.assign({}, cenario, { finalizada: true, resultado: null });
    } else {
      // tenta algumas vezes: a internet pode estar caindo justo agora
      for (let i = 0; i < 4 && !resultado; i++) {
        const { data } = await cliente().rpc("sc_finalizar", { p_tentativa: cenario.tentativa });
        if (data) resultado = data;
        else await new Promise(function (ok) { setTimeout(ok, 2000 * (i + 1)); });
      }
    }
    setTimeout(function () {
      $("encerrado").hidden = true;
      travarFundo(false);
      if (resultado) mostrarRelatorio(resultado);
      else $("encerrado-texto").textContent = "O plantão foi encerrado, mas o relatório não chegou (a internet caiu?). Entre de novo com o mesmo código para ver o resultado.";
      if (!resultado) $("encerrado").hidden = false;
    }, 1600);
  }

  // ===================== RELATÓRIO DE PÓS-INCIDENTE =====================
  function mostrarRelatorio(c) {
    cenario = c;
    encerrado = true;
    if (relogio) clearInterval(relogio);
    $("relogio").classList.remove("amarelo", "vermelho");
    $("relogio").classList.add("sem");
    $("relogio-texto").textContent = "encerrado";
    $("btn-finalizar").hidden = true;
    document.querySelector(".sc-corpo").hidden = true;
    const rel = $("relatorio");
    rel.hidden = false;
    rel.textContent = "";
    const res = c.resultado;

    const topo = el("div", "sc-rel-topo");
    topo.append(el("p", "olho", "relatório de pós-incidente · " + ((c.cliente && c.cliente.nome) || "StelaCore")),
                el("h1", "", "Plantão encerrado."));
    rel.appendChild(topo);

    if (!res) {
      rel.appendChild(el("p", "sc-nota", demo
        ? "Na demonstração não há nota: o gabarito só existe no banco, e a demonstração não fala com ele."
        : "O relatório ainda está sendo preparado. Entre de novo com o mesmo código daqui a pouco."));
      $("relatorio").focus();
      return;
    }
    const placar = el("div", "sc-placar");
    const nota = el("div", "sc-nota-grande");
    nota.append(el("strong", "", String(res.pontos)), el("span", "", "de " + res.total + " pontos"));
    const patente = el("div", "sc-patente");
    patente.append(el("span", "sc-patente-rotulo", "Patente"), el("strong", "", res.patente || "—"), el("span", "", (res.xp || 0) + " XP"));
    placar.append(nota, patente);
    rel.appendChild(placar);

    rel.appendChild(el("h2", "", "Conquistas"));
    const conq = el("ul", "sc-conquistas");
    CONQUISTAS.forEach(function (q) {
      const tem = (res.conquistas || []).indexOf(q.nome) >= 0;
      const li = el("li", tem ? "ganhou" : "");
      li.append(el("span", "sc-medalha", tem ? "★" : "☆"), el("strong", "", q.nome), el("span", "", q.explica),
                el("span", "sr-only", tem ? "(conquistada)" : "(não conquistada)"));
      conq.appendChild(li);
    });
    rel.appendChild(conq);

    rel.appendChild(el("h2", "", "Incidentes"));
    const ul = el("ul", "sc-rel-missoes");
    (res.missoes || []).forEach(function (rm) {
      const m = (c.missoes || []).find(function (x) { return x.id === rm.missao; }) || { titulo: rm.missao, servico: "" };
      const s = servicoDa(m);
      const li = el("li");
      li.style.setProperty("--cor", "var(--c-" + s.id + ")");
      li.append(icone(s.id), el("strong", "", txt(m.titulo)), el("span", "sc-rel-pontos", rm.pontos + " de " + rm.total));
      if (rm.derrubou) li.appendChild(el("span", "sc-rel-caiu", "⚠ a produção caiu"));
      ul.appendChild(li);
    });
    rel.appendChild(ul);
    if (res.comprovante) rel.appendChild(el("p", "sc-nota", "Código de verificação: " + res.comprovante + " (guarde: é o seu comprovante)."));

    if (c.gabarito && c.gabarito.length) {
      rel.appendChild(el("h2", "", "Cartas de conceito"));
      rel.appendChild(el("p", "sc-nota", MUNDO.notaGabarito || "O porquê de cada correção e onde ela fica no Azure de verdade. Boa revisão para a AZ-900 e a SC-900."));
      c.gabarito.forEach(function (g) {
        const m = (c.missoes || []).find(function (x) { return x.id === g.missao; }) || { titulo: g.missao };
        const s = servicoDa(m);
        rel.appendChild(el("h3", "", txt(m.titulo)));
        const cartas = el("ul", "sc-cartas");
        (g.correcoes || []).forEach(function (k) {
          const li = el("li", "sc-carta " + (k.certo ? "certa" : "errada"));
          li.style.setProperty("--cor", "var(--c-" + s.id + ")");
          const cab = el("div", "sc-carta-cab");
          cab.append(icone(s.id), el("span", "", k.conceito || s.nome), el("span", "sc-carta-ok", k.certo ? "✓ você corrigiu" : "✗ ficou aberto"));
          li.append(cab, el("strong", "", txt(k.texto)), el("p", "", txt(k.explicacao || "")), el("code", "", k.azure || ""));
          cartas.appendChild(li);
        });
        (g.armadilhas || []).forEach(function (a) {
          const li = el("li", "sc-carta armadilha " + (a.caiu ? "errada" : "certa"));
          const cab = el("div", "sc-carta-cab");
          cab.append(icone("alerta"), el("span", "", "Armadilha"), el("span", "sc-carta-ok", a.caiu ? "✗ você caiu" : "✓ você escapou"));
          li.append(cab, el("strong", "", txt(a.texto)), el("p", "", txt(a.explicacao || "")));
          cartas.appendChild(li);
        });
        rel.appendChild(cartas);
      });
    } else {
      rel.appendChild(el("p", "sc-nota", "O gabarito comentado, com o porquê de cada correção, aparece aqui quando a professora liberar. Entre de novo com o mesmo código depois."));
    }
    rel.focus();
  }

  // ===================== NOTIFICAÇÕES =====================
  let novas = 0;
  function notificar(texto) {
    const li = el("li");
    li.append(el("time", "", hora()), texto);
    $("lista-notificacoes").prepend(li);
    if ($("notificacoes").hidden) {
      novas++;
      $("sino-n").textContent = novas;
      $("sino-n").hidden = false;
    }
  }
  function agendarPiadas() {
    const passo = demo ? 20000 : 6 * 60000; // na demonstração, mais rápido
    PIADAS.forEach(function (p, i) { setTimeout(function () { if (!encerrado) notificar(p); }, passo * (i + 1)); });
  }
  function fecharSino() {
    $("notificacoes").hidden = true;
    $("btn-sino").setAttribute("aria-expanded", "false");
  }
  $("btn-sino").addEventListener("click", function () {
    const abrir = $("notificacoes").hidden;
    $("notificacoes").hidden = !abrir;
    this.setAttribute("aria-expanded", String(abrir));
    if (abrir) {
      novas = 0;
      $("sino-n").hidden = true;
      if (!$("lista-notificacoes").children.length) $("lista-notificacoes").appendChild(el("li", "", "Nada por enquanto. Silêncio suspeito."));
    }
  });

  // ===================== COMEÇO =====================
  if (demo) iniciarPortal(window.STELA_DEMO);
  else atualizarEntrada();
})();
