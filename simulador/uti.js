/* ===================================================================
   uti.js: o motor da UTI da Nuvem · versão 1 · 2026-10-21
   O conteúdo (controles, chamados, alertas, código vermelho) fica no uti-dados.js.
   Pontos: controles da fase 1 (os pontos de cada um), decisões (melhor 100, meio 40, ruim 0;
   no código vermelho, em dobro), combo (decisões certas seguidas: +20 por degrau, até +100),
   triagem (60 por alerta certo, 25 pelo aceitável) e, no fim, a vida da nuvem x 5.
   A cada fase, as ameaças crescem (D.pressao): sem boas decisões, os sinais vitais caem.
   Alta com louvor: vida 85 ou mais; alta: 70; em observação: 50; abaixo disso, ainda na UTI.
   O resultado vai para o ranking da turma com o login da faculdade (assets/js/conta.js, versão 5).
   Os textos entram com textContent; as animações param com o botão de pausa do site.
   =================================================================== */
(function () {
  "use strict";
  const D = window.UTI_DADOS;
  const ATIVIDADE = "uti-da-nuvem";
  const $ = (s) => document.querySelector(s);
  const palco = $("#palco");
  const pausado = () => document.documentElement.classList.contains("pausado");

  function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  const SINAIS = [
    { id: "seguranca", nome: "Pontuação de segurança", icone: "🛡️", bom: "alto" },
    { id: "risco", nome: "Risco", icone: "⚠️", bom: "baixo" },
    { id: "lgpd", nome: "LGPD", icone: "⚖️", bom: "alto" },
    { id: "disponibilidade", nome: "Disponibilidade", icone: "⚡", bom: "alto" },
    { id: "confianca", nome: "Confiança dos pacientes", icone: "💙", bom: "alto" },
  ];
  const NOMES = { seguranca: "Segurança", risco: "Risco", lgpd: "LGPD", disponibilidade: "Disponibilidade", confianca: "Confiança", orcamento: "Orçamento" };
  const PONTOS_NIVEL = { melhor: 100, meio: 40, ruim: 0 };

  let jogo;

  function novoJogo(equipe, integrantes) {
    jogo = {
      equipe, integrantes,
      vitais: Object.assign({}, D.inicio),
      escolhidos: new Set(),
      pontos: 0, combo: 0, maiorCombo: 0,
      decisoes: [], triagem: [], fase: 0,
      inicio: Date.now(),
    };
    document.querySelector("#prontuario").textContent = "";
    atualizarMonitor();
  }

  /* ---------- monitor ---------- */
  const limitar = (v) => Math.max(0, Math.min(100, Math.round(v)));
  function vida() {
    const v = jogo.vitais;
    return limitar((v.seguranca + (100 - v.risco) + v.lgpd + v.disponibilidade + v.confianca) / 5);
  }
  function estado(valor) {
    if (valor >= 75) return { texto: "Estável", classe: "ok" };
    if (valor >= 55) return { texto: "Em observação", classe: "atencao" };
    if (valor >= 35) return { texto: "Grave", classe: "grave" };
    return { texto: "Crítico", classe: "critico" };
  }

  function atualizarMonitor() {
    const caixa = $("#sinais");
    caixa.textContent = "";
    SINAIS.forEach((s) => {
      const valor = jogo.vitais[s.id];
      const bom = s.bom === "alto" ? valor : 100 - valor;
      const item = el("div", "sinal " + (bom >= 65 ? "bom" : bom >= 40 ? "medio" : "ruim"));
      const topo = el("div", "sinal-topo");
      topo.appendChild(el("span", "", s.icone + " " + s.nome));
      topo.appendChild(el("strong", "", String(valor)));
      const barra = el("div", "sinal-barra");
      const cheio = el("span");
      cheio.style.width = valor + "%";
      barra.appendChild(cheio);
      item.appendChild(topo);
      item.appendChild(barra);
      caixa.appendChild(item);
    });
    const v = vida();
    $("#vida").textContent = v;
    const e = estado(v);
    const caixaEstado = $("#estado");
    caixaEstado.textContent = e.texto;
    caixaEstado.className = "monitor-estado " + e.classe;
    document.body.dataset.estado = e.classe;
    $("#pontos").textContent = jogo.pontos;
    $("#combo").textContent = "x" + jogo.combo;
    $("#fase").textContent = jogo.fase + "/5";
    // o mini-placar do celular (fica fixo embaixo da tela)
    $("#mini").textContent = "❤️ " + v + "%  ·  ⭐ " + jogo.pontos + "  ·  🔥 x" + jogo.combo;
    $("#mini").className = "uti-mini " + e.classe;
  }

  function aplicar(efeitos, peso) {
    Object.keys(efeitos || {}).forEach((k) => {
      if (k === "orcamento") return;
      jogo.vitais[k] = limitar(jogo.vitais[k] + efeitos[k] * (peso || 1));
    });
  }

  function chipsEfeitos(efeitos, peso) {
    const linha = el("div", "efeitos");
    Object.keys(efeitos || {}).forEach((k) => {
      const valor = efeitos[k] * (peso || 1);
      const bom = k === "risco" ? valor < 0 : valor > 0;
      linha.appendChild(el("span", "efeito " + (bom ? "mais" : "menos"), NOMES[k] + " " + (valor > 0 ? "+" : "") + valor));
    });
    return linha;
  }

  function anotar(icone, texto, classe) {
    const li = el("li", classe || "");
    const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    li.appendChild(el("span", "hora", hora));
    li.appendChild(el("span", "", icone + " " + texto));
    $("#prontuario").prepend(li);
  }

  /* ---------- efeitos visuais ---------- */
  function flash(tipo) {
    const f = $(".uti-flash");
    f.className = "uti-flash " + tipo;
    void f.offsetWidth;
    f.classList.add("ativo");
    if (tipo === "ruim" && !pausado()) {
      document.body.classList.remove("tremor");
      void document.body.offsetWidth;
      document.body.classList.add("tremor");
    }
  }

  function pontosVoando(texto, alvo) {
    if (pausado()) return;
    const p = el("span", "voando", texto);
    const r = (alvo || palco).getBoundingClientRect();
    p.style.left = r.left + r.width / 2 + "px";
    p.style.top = r.top + window.scrollY + 20 + "px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1300);
  }

  // confete num canvas por cima da página
  const confete = $(".uti-confete");
  const ctxC = confete.getContext("2d");
  let pedacos = [];
  function soltarConfete(qtd) {
    if (pausado()) return;
    confete.width = innerWidth;
    confete.height = innerHeight;
    const cores = ["#ecc874", "#9fd0b7", "#ff7aa8", "#7ad7ff", "#c7a0ff", "#ffffff"];
    for (let i = 0; i < qtd; i++) {
      pedacos.push({ x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight / 3, vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -12 - 3, r: Math.random() * 6 + 3, c: cores[i % cores.length], giro: Math.random() * 6, vida: 90 });
    }
    if (pedacos.length === qtd) requestAnimationFrame(animarConfete);
  }
  function animarConfete() {
    ctxC.clearRect(0, 0, confete.width, confete.height);
    pedacos = pedacos.filter((p) => p.vida > 0);
    pedacos.forEach((p) => {
      p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.giro += 0.2; p.vida--;
      ctxC.save(); ctxC.translate(p.x, p.y); ctxC.rotate(p.giro);
      ctxC.fillStyle = p.c; ctxC.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); ctxC.restore();
    });
    if (pedacos.length) requestAnimationFrame(animarConfete);
    else ctxC.clearRect(0, 0, confete.width, confete.height);
  }

  /* ---------- o monitor cardíaco (ECG) ---------- */
  const ecg = $("#ecg");
  const ctx = ecg.getContext("2d");
  let xEcg = 0, ultimoY = 60, faseBatida = 0;
  function corEcg() {
    const e = document.body.dataset.estado;
    return e === "critico" ? "#ff4d6d" : e === "grave" ? "#ff9f43" : e === "atencao" ? "#ecc874" : "#3cf2a0";
  }
  function desenharEcg() {
    const largura = ecg.clientWidth;
    if (ecg.width !== largura) { ecg.width = largura; xEcg = 0; }
    if (!pausado() && jogo) {
      const v = vida();
      const passo = 2.2;
      // mais risco, coração mais acelerado; vida muito baixa, quase reto
      const intervalo = 90 - (jogo.vitais.risco * 0.5);
      faseBatida = (faseBatida + 1) % Math.max(30, Math.round(intervalo));
      let y = 60 + Math.sin(xEcg / 9) * 1.5;
      if (v >= 20) {
        if (faseBatida === 6) y = 70;
        else if (faseBatida === 8) y = 8;
        else if (faseBatida === 10) y = 96;
        else if (faseBatida === 12) y = 55;
        else if (faseBatida > 18 && faseBatida < 26) y = 60 - Math.sin((faseBatida - 18) / 8 * Math.PI) * 10;
      }
      ctx.fillStyle = "rgba(4, 10, 14, 0.18)";
      ctx.fillRect(xEcg, 0, 14, ecg.height);
      ctx.strokeStyle = corEcg();
      ctx.lineWidth = 2.4;
      ctx.shadowColor = corEcg();
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(xEcg - passo, ultimoY);
      ctx.lineTo(xEcg, y);
      ctx.stroke();
      ultimoY = y;
      xEcg += passo;
      if (xEcg > ecg.width) { xEcg = 0; }
    }
    requestAnimationFrame(desenharEcg);
  }

  // fundo: pontinhos de luz subindo, como bolhas de soro
  const fundo = $(".uti-fundo");
  const ctxF = fundo.getContext("2d");
  const bolhas = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 2 + 0.6, v: Math.random() * 0.0015 + 0.0005 }));
  function desenharFundo() {
    fundo.width = innerWidth; fundo.height = innerHeight;
    ctxF.clearRect(0, 0, fundo.width, fundo.height);
    bolhas.forEach((b) => {
      if (!pausado()) { b.y -= b.v; if (b.y < -0.02) { b.y = 1.02; b.x = Math.random(); } }
      ctxF.beginPath();
      ctxF.arc(b.x * fundo.width, b.y * fundo.height, b.r, 0, Math.PI * 2);
      ctxF.fillStyle = "rgba(159, 208, 183, 0.35)";
      ctxF.fill();
    });
    setTimeout(() => requestAnimationFrame(desenharFundo), 50);
  }

  /* ---------- telas ---------- */
  function limparPalco(classe, semRolar) {
    palco.textContent = "";
    palco.className = "palco " + (classe || "");
    if (!semRolar) palco.scrollIntoView({ behavior: pausado() ? "auto" : "smooth", block: "start" });
  }
  function botao(texto, classe, acao) {
    const b = el("button", "uti-botao " + (classe || ""), texto);
    b.type = "button";
    b.addEventListener("click", acao);
    return b;
  }
  function etiquetaFase(texto) {
    return el("span", "etiqueta-fase", texto);
  }

  // tela inicial
  let primeiraVez = true;
  function telaInicio() {
    jogo = jogo || { vitais: Object.assign({}, D.inicio), pontos: 0, combo: 0, fase: 0 };
    atualizarMonitor();
    limparPalco("inicio", primeiraVez);
    primeiraVez = false;
    palco.appendChild(el("p", "uti-olho", "🚑 Simulador gamificado · Segurança em Nuvem"));
    palco.appendChild(el("h1", "uti-titulo", "UTI da Nuvem"));
    palco.appendChild(el("p", "uti-lead", "A Clínica Bem Cuidar levou os prontuários dos pacientes para a nuvem. Configurações erradas, senhas fracas e ninguém olhando os logs: a nuvem deu entrada na UTI. A sua equipe é o plantão de segurança. Cada decisão mexe nos sinais vitais. Consegue dar alta para ela?"));
    const form = el("form", "uti-form");
    const l1 = el("label", "", "Nome da equipe");
    const i1 = el("input"); i1.name = "equipe"; i1.required = true; i1.maxLength = 40; i1.placeholder = "Ex.: Plantão Zero Trust";
    l1.appendChild(i1);
    const l2 = el("label", "", "Integrantes (primeiro nome)");
    const i2 = el("input"); i2.name = "integrantes"; i2.maxLength = 120; i2.placeholder = "Ana, Bruno, Carla";
    l2.appendChild(i2);
    form.appendChild(l1); form.appendChild(l2);
    const iniciar = botao("🚑 Dar entrada na UTI", "principal", () => {});
    iniciar.type = "submit";
    form.appendChild(iniciar);
    const msg = el("p", "uti-sub");
    form.appendChild(msg);
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const equipe = i1.value.trim();
      if (equipe.length < 2) { msg.textContent = "Dê um nome para a equipe."; i1.focus(); return; }
      novoJogo(equipe, i2.value.trim());
      anotar("🚑", "A nuvem deu entrada na UTI. Plantão: " + equipe + ".");
      telaControles();
    });
    palco.appendChild(form);
    const login = el("p", "uti-aviso-login");
    login.appendChild(document.createTextNode("Para a pontuação entrar no ranking da turma, uma pessoa da equipe entra com o e-mail da faculdade (botão "));
    login.appendChild(el("strong", "", "Entrar"));
    login.appendChild(document.createTextNode(", no topo). Dá para jogar sem login também."));
    palco.appendChild(login);
  }

  // fase 1: admissão
  function telaControles() {
    jogo.fase = 1;
    atualizarMonitor();
    limparPalco("fase1");
    palco.appendChild(etiquetaFase("Fase 1 de 5 · Admissão"));
    palco.appendChild(el("h2", "", "🧾 O orçamento da internação"));
    palco.appendChild(el("p", "uti-lead", "A diretoria liberou R$ 100 mil para proteger a nuvem. Escolham os controles: não dá para comprar tudo. O que ficar de fora vai pesar nos chamados das próximas fases."));
    const saldo = el("p", "saldo");
    const grade = el("div", "controles");
    function custoTotal() {
      return D.controles.filter((c) => jogo.escolhidos.has(c.id)).reduce((s, c) => s + c.custo, 0);
    }
    function redesenharSaldo() {
      const resta = D.inicio.orcamento - custoTotal();
      saldo.textContent = "💰 Restam R$ " + resta + " mil";
      saldo.classList.toggle("zerado", resta < 10);
      grade.querySelectorAll(".controle").forEach((card) => {
        const c = D.controles.find((x) => x.id === card.dataset.id);
        const marcado = jogo.escolhidos.has(c.id);
        card.setAttribute("aria-pressed", String(marcado));
        card.disabled = !marcado && c.custo > resta;
      });
    }
    D.controles.forEach((c) => {
      const card = el("button", "controle");
      card.type = "button";
      card.dataset.id = c.id;
      card.appendChild(el("span", "controle-icone", c.icone));
      card.appendChild(el("strong", "", c.nome));
      card.appendChild(el("span", "controle-texto", c.texto));
      card.appendChild(el("span", "controle-nuvens", "AWS: " + c.aws + " · Azure: " + c.azure));
      card.appendChild(el("span", "controle-custo", "R$ " + c.custo + " mil"));
      card.addEventListener("click", () => {
        if (jogo.escolhidos.has(c.id)) jogo.escolhidos.delete(c.id);
        else jogo.escolhidos.add(c.id);
        redesenharSaldo();
      });
      grade.appendChild(card);
    });
    palco.appendChild(saldo);
    palco.appendChild(grade);
    palco.appendChild(botao("✅ Confirmar a internação", "principal", () => {
      if (!jogo.escolhidos.size) { saldo.textContent = "Escolham pelo menos um controle."; return; }
      let pontos = 0;
      D.controles.forEach((c) => {
        if (jogo.escolhidos.has(c.id)) { aplicar(c.efeitos); pontos += c.pontos; }
      });
      jogo.pontos += pontos;
      jogo.vitais.orcamento = D.inicio.orcamento - custoTotal();
      anotar("🧾", "Controles escolhidos: " + D.controles.filter((c) => jogo.escolhidos.has(c.id)).map((c) => c.nome).join(", ") + ".");
      atualizarMonitor();
      pontosVoando("+" + pontos);
      soltarConfete(60);
      flash("melhor");
      filaEventos();
    }));
    redesenharSaldo();
  }

  // fases 2 e 3, e o código vermelho (fase 5), uma decisão por vez
  let fila = [];
  function filaEventos() {
    fila = [];
    D.fases.forEach((f) => {
      fila.push({ tipo: "intro", fase: f });
      f.eventos.forEach((e) => fila.push({ tipo: "evento", fase: f, evento: e }));
    });
    fila.push({ tipo: "triagem" });
    fila.push({ tipo: "intro-crise" });
    D.crise.passos.forEach((p) => fila.push({ tipo: "crise", evento: p }));
    fila.push({ tipo: "fim" });
    proximo();
  }
  function proximo() {
    const item = fila.shift();
    if (!item) return;
    if (item.tipo === "intro") telaIntro(item.fase);
    else if (item.tipo === "evento") telaEvento(item.evento, item.fase, false);
    else if (item.tipo === "triagem") telaTriagem();
    else if (item.tipo === "intro-crise") telaIntroCrise();
    else if (item.tipo === "crise") telaEvento(item.evento, null, true);
    else telaFim();
  }

  // a cada fase, as ameaças crescem (D.pressao)
  function pressionar() {
    aplicar(D.pressao);
    anotar("📈", "As ameaças aumentaram.", "alerta");
    atualizarMonitor();
    const aviso = el("div", "pressao");
    aviso.appendChild(el("strong", "", "📈 As ameaças aumentaram: novos ataques circulando."));
    aviso.appendChild(chipsEfeitos(D.pressao));
    return aviso;
  }

  function telaIntro(fase) {
    jogo.fase = fase.numero;
    limparPalco("intro");
    palco.appendChild(etiquetaFase("Fase " + fase.numero + " de 5"));
    palco.appendChild(el("h2", "", fase.icone + " " + fase.nome));
    palco.appendChild(el("p", "uti-lead", fase.intro));
    palco.appendChild(pressionar());
    palco.appendChild(botao("Atender o primeiro chamado →", "principal", proximo));
  }

  function telaIntroCrise() {
    jogo.fase = 5;
    limparPalco("intro crise");
    flash("ruim");
    palco.appendChild(etiquetaFase("Fase 5 de 5 · Código vermelho"));
    palco.appendChild(el("h2", "", "🚨 CÓDIGO VERMELHO"));
    palco.appendChild(el("p", "uti-lead", D.crise.intro));
    palco.appendChild(pressionar());
    anotar("🚨", "Código vermelho: fichas à venda num fórum.", "alerta");
    palco.appendChild(botao("Assumir o incidente →", "perigo", proximo));
  }

  function telaEvento(evento, fase, crise) {
    limparPalco(crise ? "evento crise" : "evento");
    palco.appendChild(etiquetaFase(crise ? "Código vermelho · pontos em dobro" : "Fase " + fase.numero + " · " + fase.nome));
    if (evento.de) palco.appendChild(el("p", "evento-de", "📞 Chamado de: " + evento.de));
    palco.appendChild(el("h2", "", evento.titulo));
    palco.appendChild(el("p", "uti-lead", evento.texto));
    if (evento.aws) {
      const nuvens = el("p", "evento-nuvens");
      nuvens.appendChild(el("span", "nuvem aws", "AWS · " + evento.aws));
      nuvens.appendChild(el("span", "nuvem azure", "Azure · " + evento.azure));
      palco.appendChild(nuvens);
    }
    const opcoes = el("div", "opcoes");
    // as opções aparecem em ordem aleatória
    const embaralhadas = evento.opcoes.slice().sort(() => Math.random() - 0.5);
    embaralhadas.forEach((op, i) => {
      const b = botao(String.fromCharCode(65 + i) + ") " + op.texto, "opcao", () => decidir(evento, op, crise, b, opcoes));
      opcoes.appendChild(b);
    });
    palco.appendChild(opcoes);
    opcoes.querySelector("button").focus({ preventScroll: true });
  }

  function decidir(evento, op, crise, botaoClicado, opcoes) {
    opcoes.querySelectorAll("button").forEach((b) => { b.disabled = true; });
    botaoClicado.classList.add("escolhida", op.nivel);
    const peso = crise ? 2 : 1;
    aplicar(op.efeitos, crise ? 1.5 : 1);
    let pontos = PONTOS_NIVEL[op.nivel] * peso;
    if (op.nivel === "melhor") {
      jogo.combo++;
      jogo.maiorCombo = Math.max(jogo.maiorCombo, jogo.combo);
      if (jogo.combo >= 2) pontos += Math.min(100, 20 * (jogo.combo - 1));
    } else {
      jogo.combo = 0;
    }
    jogo.pontos += pontos;
    const falta = evento.semControle && !jogo.escolhidos.has(evento.semControle.id) ? evento.semControle : null;
    if (falta) aplicar(falta.efeitos);
    jogo.decisoes.push({ titulo: evento.titulo, escolha: op.texto, nivel: op.nivel, crise, pontos });
    atualizarMonitor();
    flash(op.nivel);
    pontosVoando(pontos ? "+" + pontos + (jogo.combo >= 2 && op.nivel === "melhor" ? " 🔥x" + jogo.combo : "") : "0", botaoClicado);
    if (op.nivel === "melhor") soltarConfete(jogo.combo >= 3 ? 80 : 35);
    anotar(op.nivel === "melhor" ? "✅" : op.nivel === "meio" ? "🟡" : "❌", evento.titulo + ": " + op.texto, op.nivel === "ruim" ? "alerta" : "");

    const fb = el("div", "feedback " + op.nivel);
    fb.appendChild(el("strong", "", op.nivel === "melhor" ? "✅ Boa decisão!" : op.nivel === "meio" ? "🟡 Quase: dava para fazer melhor." : "❌ Decisão perigosa."));
    fb.appendChild(el("p", "", op.porque));
    fb.appendChild(chipsEfeitos(op.efeitos, crise ? 1.5 : 1));
    if (falta) {
      fb.appendChild(el("p", "falta", "⚠️ " + falta.texto));
      fb.appendChild(chipsEfeitos(falta.efeitos));
    }
    if (op.nivel !== "melhor") {
      const melhor = evento.opcoes.find((o) => o.nivel === "melhor");
      fb.appendChild(el("p", "dica-melhor", "💡 O melhor caminho: " + melhor.texto));
    }
    fb.appendChild(botao("Próximo →", "principal", proximo));
    palco.appendChild(fb);
    fb.querySelector("button").focus({ preventScroll: true });
    fb.scrollIntoView({ behavior: pausado() ? "auto" : "smooth", block: "nearest" });
  }

  // fase 4: triagem dos alertas
  function telaTriagem() {
    jogo.fase = 4;
    limparPalco("triagem");
    palco.appendChild(etiquetaFase("Fase 4 de 5 · Triagem"));
    palco.appendChild(el("h2", "", "🦉 O painel acendeu"));
    palco.appendChild(el("p", "uti-lead", D.triagem.intro));
    palco.appendChild(pressionar());
    const lista = el("ol", "alertas");
    const respostas = {};
    const ROTULOS = { ataque: "🔴 Ataque", falso: "🟢 Alarme falso", investigar: "🟡 Investigar" };
    D.triagem.alertas.forEach((a, i) => {
      const li = el("li", "alerta-item");
      li.appendChild(el("span", "alerta-fonte", a.fonte));
      li.appendChild(el("p", "", a.texto));
      const botoes = el("div", "alerta-botoes");
      Object.keys(ROTULOS).forEach((chave) => {
        const b = botao(ROTULOS[chave], "triar " + chave, () => {
          respostas[i] = chave;
          botoes.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          conferir.disabled = Object.keys(respostas).length < D.triagem.alertas.length;
        });
        b.setAttribute("aria-pressed", "false");
        botoes.appendChild(b);
      });
      li.appendChild(botoes);
      lista.appendChild(li);
    });
    palco.appendChild(lista);
    const conferir = botao("🩺 Fechar a triagem", "principal", () => {
      conferir.disabled = true;
      let pontos = 0, certos = 0;
      lista.querySelectorAll(".alerta-item").forEach((li, i) => {
        const a = D.triagem.alertas[i];
        const r = respostas[i];
        const acertou = r === a.certo;
        const meio = !acertou && a.aceita === r;
        if (acertou) { pontos += 60; certos++; } else if (meio) pontos += 25;
        li.classList.add(acertou ? "certo" : meio ? "meio" : "errado");
        li.querySelectorAll("button").forEach((b) => { b.disabled = true; });
        li.appendChild(el("p", "alerta-porque", (acertou ? "✅ " : meio ? "🟡 " : "❌ Era: " + ROTULOS[a.certo] + ". ") + a.porque));
      });
      jogo.triagem = { certos, total: D.triagem.alertas.length };
      jogo.pontos += pontos;
      aplicar({ seguranca: certos - 3, risco: (3 - certos) * 2 });
      atualizarMonitor();
      anotar("🦉", "Triagem: " + certos + " de " + D.triagem.alertas.length + " alertas certos.");
      flash(certos >= 5 ? "melhor" : certos >= 3 ? "meio" : "ruim");
      pontosVoando("+" + pontos, conferir);
      if (certos >= 5) soltarConfete(70);
      palco.appendChild(botao("Seguir o plantão →", "principal", proximo));
      palco.lastChild.focus({ preventScroll: true });
    });
    conferir.disabled = true;
    palco.appendChild(conferir);
  }

  /* ---------- a alta: o relatório final ---------- */
  function pontosMaximos() {
    // controles: a melhor combinação dentro do orçamento (problema da mochila, pequeno)
    const lim = D.inicio.orcamento;
    const melhor = new Array(lim + 1).fill(0);
    D.controles.forEach((c) => {
      for (let o = lim; o >= c.custo; o--) melhor[o] = Math.max(melhor[o], melhor[o - c.custo] + c.pontos);
    });
    const comuns = D.fases.reduce((s, f) => s + f.eventos.length, 0);
    const total = comuns + D.crise.passos.length;
    let combo = 0;
    for (let k = 2; k <= total; k++) combo += Math.min(100, 20 * (k - 1));
    return melhor[lim] + comuns * 100 + D.crise.passos.length * 200 + combo + D.triagem.alertas.length * 60 + 100 * 5;
  }

  function insigniasGanhas() {
    const ganhas = [];
    const fase2 = jogo.decisoes.filter((d) => !d.crise).slice(0, D.fases[0].eventos.length);
    if (fase2.length && fase2.every((d) => d.nivel === "melhor")) ganhas.push("identidade");
    if (jogo.escolhidos.has("cofre") && jogo.escolhidos.has("storage")) ganhas.push("cofre");
    if (jogo.triagem.certos >= 6) ganhas.push("lince");
    const crise = jogo.decisoes.filter((d) => d.crise);
    if (crise.length && crise.every((d) => d.nivel === "melhor")) ganhas.push("bombeiro");
    if (jogo.maiorCombo >= 5) ganhas.push("combo");
    if (jogo.vitais.lgpd >= 80) ganhas.push("lgpd");
    return ganhas;
  }

  function telaFim() {
    const v = vida();
    const bonus = v * 5;
    jogo.pontos += bonus;
    const maximo = pontosMaximos();
    const pontos = Math.min(jogo.pontos, maximo);
    const ganhas = insigniasGanhas();
    const alta = v >= 85 ? { t: "🏆 Alta com louvor", c: "louvor" } : v >= 70 ? { t: "✅ Alta", c: "alta" }
      : v >= 50 ? { t: "🟡 Em observação", c: "observacao" } : { t: "🚑 Ainda na UTI", c: "uti" };
    atualizarMonitor();
    limparPalco("fim " + alta.c);
    soltarConfete(v >= 65 ? 160 : 40);
    anotar("📄", "Relatório de alta: " + alta.t + ", " + pontos + " pontos.");
    palco.appendChild(etiquetaFase("Relatório de alta · " + jogo.equipe));
    palco.appendChild(el("h2", "alta-titulo", alta.t));
    const placar = el("div", "fim-placar");
    [["Pontos", pontos + " / " + maximo], ["Vida da nuvem", v + "%"], ["Maior combo", "x" + jogo.maiorCombo],
     ["Triagem", jogo.triagem.certos + " de " + jogo.triagem.total]].forEach(([n, val]) => {
      const c = el("div");
      c.appendChild(el("span", "", n));
      c.appendChild(el("strong", "", val));
      placar.appendChild(c);
    });
    palco.appendChild(placar);
    palco.appendChild(el("p", "uti-sub", "Bônus de vida no fim: +" + bonus + " pontos (a vida da nuvem x 5)."));

    palco.appendChild(el("h3", "", "🎖️ Insígnias"));
    const ins = el("div", "insignias");
    D.insignias.forEach((i) => {
      const ok = ganhas.includes(i.id);
      const card = el("div", "insignia " + (ok ? "ganha" : "trancada"));
      card.appendChild(el("span", "insignia-icone", ok ? i.icone : "🔒"));
      card.appendChild(el("strong", "", i.nome));
      card.appendChild(el("span", "", i.texto));
      ins.appendChild(card);
    });
    palco.appendChild(ins);

    palco.appendChild(el("h3", "", "🩻 As decisões do plantão (para o debriefing)"));
    const tabela = el("ol", "revisao");
    jogo.decisoes.forEach((d) => {
      const li = el("li", d.nivel);
      li.appendChild(el("strong", "", (d.crise ? "🚨 " : "") + d.titulo));
      li.appendChild(el("span", "", (d.nivel === "melhor" ? "✅ " : d.nivel === "meio" ? "🟡 " : "❌ ") + d.escolha + " (+" + d.pontos + ")"));
      tabela.appendChild(li);
    });
    palco.appendChild(tabela);

    const fora = D.controles.filter((c) => !jogo.escolhidos.has(c.id)).map((c) => c.nome);
    if (fora.length) palco.appendChild(el("p", "uti-sub", "Ficaram de fora na admissão: " + fora.join(", ") + "."));

    const reg = el("p", "registro");
    palco.appendChild(reg);
    const acoes = el("div", "fim-acoes");
    acoes.appendChild(botao("🔁 Novo plantão", "", () => { jogo = null; telaInicio(); }));
    acoes.appendChild(botao("🖨️ Imprimir o relatório", "", () => window.print()));
    palco.appendChild(acoes);

    const resultado = { pontos, maximo, vida: v, ganhas };
    guardarLocal(resultado);
    registrar(resultado, reg);
  }

  /* ---------- ranking: o da turma (com login) e o deste computador ---------- */
  const CHAVE_LOCAL = "uti-da-nuvem:ranking";
  function lerLocal() {
    try { return JSON.parse(localStorage.getItem(CHAVE_LOCAL)) || []; } catch (e) { return []; }
  }
  function guardarLocal(r) {
    const lista = lerLocal();
    lista.push({ equipe: jogo.equipe, pontos: r.pontos, vida: r.vida, quando: new Date().toISOString() });
    lista.sort((a, b) => b.pontos - a.pontos);
    try { localStorage.setItem(CHAVE_LOCAL, JSON.stringify(lista.slice(0, 20))); } catch (e) { /* sem armazenamento */ }
    desenharRanking();
  }

  async function registrar(r, caixa) {
    if (!window.CONTA || !CONTA.daFaculdade()) {
      caixa.textContent = "Sem login da faculdade: a pontuação ficou só no ranking deste computador. Entre (botão Entrar, no topo) e jogue de novo para aparecer no ranking da turma.";
      return;
    }
    caixa.textContent = "Registrando no ranking da turma…";
    const registro = await CONTA.registrarTentativa({
      atividade: ATIVIDADE,
      titulo: "UTI da Nuvem",
      acertos: r.pontos,
      total: r.maximo,
      duracao_seg: (Date.now() - jogo.inicio) / 1000,
      detalhes: { equipe: jogo.equipe, integrantes: jogo.integrantes, vida: r.vida, insignias: r.ganhas, combo: jogo.maiorCombo,
        controles: Array.from(jogo.escolhidos), decisoes: jogo.decisoes.map((d) => d.nivel) },
    });
    caixa.textContent = registro ? "✅ Registrado no ranking da turma. Código de verificação: " + registro.codigo : "Não deu para registrar agora. A pontuação ficou no ranking deste computador.";
    desenharRanking();
  }

  async function desenharRanking() {
    const lista = $("#ranking-lista");
    const aviso = $("#ranking-aviso");
    let linhas = null;
    if (window.CONTA && CONTA.ranking && CONTA.daFaculdade()) linhas = await CONTA.ranking(ATIVIDADE);
    lista.textContent = "";
    if (linhas && linhas.length) {
      aviso.textContent = "As melhores pontuações da turma (a melhor de cada pessoa que entrou com o login da faculdade).";
      linhas.forEach((l) => lista.appendChild(linhaRanking(l.posicao, l.equipe || l.nome, l.nome, l.pontos, l.eu)));
      return;
    }
    const local = lerLocal();
    aviso.textContent = window.CONTA && CONTA.daFaculdade()
      ? "Ainda ninguém da turma entrou no ranking. Por enquanto, as equipes que jogaram neste computador:"
      : "As equipes que jogaram neste computador. Entre com o e-mail da faculdade para ver o ranking da turma toda.";
    if (!local.length) { lista.appendChild(el("li", "vazio", "Ninguém jogou ainda. Seja a primeira equipe!")); return; }
    local.slice(0, 10).forEach((l, i) => lista.appendChild(linhaRanking(i + 1, l.equipe, "", l.pontos, false)));
  }
  function linhaRanking(pos, equipe, nome, pontos, eu) {
    const li = el("li", eu ? "eu" : "");
    li.appendChild(el("span", "pos", pos <= 3 ? ["🥇", "🥈", "🥉"][pos - 1] : pos + "º"));
    const quem = el("span", "quem", equipe);
    if (nome && nome !== equipe) quem.appendChild(el("small", "", " · " + nome));
    li.appendChild(quem);
    li.appendChild(el("strong", "", pontos + " pts"));
    return li;
  }

  /* ---------- começa ---------- */
  telaInicio();
  requestAnimationFrame(desenharEcg);
  desenharFundo();
  desenharRanking();
  window.addEventListener("load", () => {
    if (window.CONTA && CONTA.aoMudar) CONTA.aoMudar(() => desenharRanking());
  });
})();
