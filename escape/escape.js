/*
  escape.js: o escape room Agente da Nuvem (Genially exportado em agente-secreto/), com login e entrega.
  versão 1 · 2026-11-05

  1. O jogo só carrega depois do login com o e-mail da faculdade (data-exige-login + conta.js).
  2. No fim do jogo, o distintivo mostra o código da credencial. O aluno digita aqui.
  3. Código certo: a entrega vai para o Supabase (disc_tentativas, atividade "agente-secreto", 1 de 1)
     e o Placa-Mãe da professora busca de lá. Vale 1 ponto (definido no Placa-Mãe).
  A página guarda só a impressão digital (SHA-256) do código, não o código em si.
*/

(function () {
  "use strict";

  var ATIVIDADE = "agente-secreto";
  var TITULO = "Escape room: Agente da Nuvem";
  // impressão digital do código da credencial (SHA-256 do código em maiúsculas, sem acento nem espaço)
  var DIGITAL = "d66ea6c8eae4d5e5100c5775ee8ce0141fea4110a29cfa4c584bd5d49b425af2";
  var CHAVE_INICIO = "escape-agente:inicio";

  var quadro = document.getElementById("escape-quadro");
  var espera = document.getElementById("escape-espera");
  var form = document.getElementById("escape-form");
  var campo = document.getElementById("escape-codigo");
  var retorno = document.getElementById("escape-retorno");
  var tentativas = 0;
  var enviando = false;

  // ---------- o jogo abre só com o login da faculdade ----------
  function abreJogo() {
    if (!window.CONTA || !CONTA.daFaculdade() || quadro.getAttribute("src")) return;
    quadro.setAttribute("src", "agente-secreto/index.html");
    espera.hidden = true;
    // a hora em que começou fica guardada nesta aba (para medir quanto tempo levou)
    try {
      if (!sessionStorage.getItem(CHAVE_INICIO)) sessionStorage.setItem(CHAVE_INICIO, String(Date.now()));
    } catch (e) { /* sem armazenamento: mede a partir de agora */ }
  }

  function inicio() {
    try {
      return Number(sessionStorage.getItem(CHAVE_INICIO)) || Date.now();
    } catch (e) {
      return Date.now();
    }
  }

  if (window.CONTA) CONTA.aoMudar(abreJogo);

  // ---------- conferir o código ----------
  function normaliza(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "").toUpperCase();
  }

  async function digital(texto) {
    var bytes = new TextEncoder().encode(texto);
    var hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash)).map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  function avisa(tipo, html) {
    retorno.className = "escape-retorno" + (tipo ? " " + tipo : "");
    retorno.innerHTML = html;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (enviando) return;
    if (!window.CONTA || !CONTA.daFaculdade()) {
      avisa("errado", "Entre com o e-mail da faculdade (botão Entrar, no topo) para entregar.");
      return;
    }
    var codigo = normaliza(campo.value);
    if (!codigo) {
      avisa("errado", "Digite o código que aparece no seu distintivo, no fim do jogo.");
      campo.focus();
      return;
    }
    tentativas++;
    if ((await digital(codigo)) !== DIGITAL) {
      avisa("errado", "Curto-circuito. Esse não é o código da credencial. Confere o distintivo no fim do jogo e tenta de novo.");
      campo.select();
      return;
    }

    enviando = true;
    avisa("", "Soldando os componentes... registrando a sua entrega.");
    var registro = await CONTA.registrarTentativa({
      atividade: ATIVIDADE,
      titulo: TITULO,
      acertos: 1,
      total: 1,
      duracao_seg: (Date.now() - inicio()) / 1000,
      detalhes: { codigo: codigo, tentativas_codigo: tentativas }
    });
    enviando = false;
    if (registro) {
      avisa("certo", "Compilou de primeira! 🕵️ Credencial entregue. Você agora é Agente da Nuvem.<br>" +
        "Código de verificação: <b>" + registro.codigo + "</b> (guarde, é o seu comprovante).");
      festa();
    } else {
      avisa("errado", "Não deu para registrar agora (a internet caiu?). Espere um pouco e aperte Entregar de novo.");
    }
  });

  // ---------- estrelinhas na entrega (param com o botão de pausa) ----------
  function festa() {
    if (document.documentElement.classList.contains("pausado")) return;
    var caixa = form.parentNode;
    var f = document.createElement("div");
    f.className = "escape-festa";
    f.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 16; i++) {
      var s = document.createElement("span");
      s.textContent = ["🕵️", "✨", "🔐", "⭐"][i % 4];
      s.style.setProperty("--x", (Math.random() * 100) + "%");
      s.style.setProperty("--d", (Math.random() * .4) + "s");
      f.appendChild(s);
    }
    caixa.appendChild(f);
    setTimeout(function () {
      f.remove();
    }, 1900);
  }
})();
