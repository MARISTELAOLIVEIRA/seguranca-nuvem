/*
  copiar-codigo.js: botão "Copiar" nos blocos de código dos tutoriais (<div class="arquivo-codigo">).
  Copia o código sem os números das linhas. versão 1 · 2026-10-16
*/
(function () {
  function textoDoCodigo(pre) {
    return Array.from(pre.querySelectorAll(".linha")).map(function (linha) {
      const copia = linha.cloneNode(true);
      const numero = copia.querySelector(".num");
      if (numero) {
        numero.remove();
      }
      return copia.textContent;
    }).join("\n");
  }

  function copiar(texto, area, aoCopiar) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(aoCopiar, function () { naMao(texto, aoCopiar); });
    } else {
      naMao(texto, aoCopiar);
    }
  }

  // sem a área de transferência (página sem https): copia por uma caixa de texto escondida
  function naMao(texto, aoCopiar) {
    const caixa = document.createElement("textarea");
    caixa.value = texto;
    caixa.setAttribute("readonly", "");
    caixa.style.position = "fixed";
    caixa.style.opacity = "0";
    document.body.appendChild(caixa);
    caixa.select();
    try {
      document.execCommand("copy");
    } catch (erro) {
      // sem jeito de copiar: o aluno seleciona com o mouse
    }
    caixa.remove();
    aoCopiar();
  }

  document.querySelectorAll(".arquivo-codigo").forEach(function (bloco) {
    const botao = bloco.querySelector(".arquivo-cab button");
    const pre = bloco.querySelector("pre.codigo");
    if (!botao || !pre) {
      return;
    }
    let volta = null;
    botao.addEventListener("click", function () {
      copiar(textoDoCodigo(pre), pre, function () {
        botao.textContent = "✓ Copiado";
        clearTimeout(volta);
        volta = setTimeout(function () { botao.textContent = "⧉ Copiar"; }, 2500);
      });
    });
  });
})();
