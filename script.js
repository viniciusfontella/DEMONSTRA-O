(function () {
  "use strict";

  // Ano no rodapé
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Cabeçalho com sombra ao rolar
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("menu");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var aberto = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!aberto));
      toggle.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("open", !aberto);
    });
    // Fecha o menu ao clicar em um link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
        nav.classList.remove("open");
      });
    });
  }

  // Horário de funcionamento: aberto/fechado agora (fuso de São Paulo)
  var OPEN_HOUR = 9;
  var CLOSE_HOUR = 18;

  function horarioSaoPaulo() {
    var partes = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      hour: "numeric",
      hour12: false
    }).formatToParts(new Date());

    var dias = { dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sáb: 6, sab: 6 };
    var diaTexto = (partes.find(function (p) { return p.type === "weekday"; }) || {}).value || "";
    var hora = parseInt((partes.find(function (p) { return p.type === "hour"; }) || {}).value, 10);

    return {
      dia: dias[diaTexto.toLowerCase().replace(".", "")],
      hora: hora
    };
  }

  function atualizarHorarios() {
    var agora = horarioSaoPaulo();
    var status = document.getElementById("status-agora");
    var linhas = document.querySelectorAll(".hours tr[data-day]");

    linhas.forEach(function (linha) {
      linha.classList.toggle("today", Number(linha.dataset.day) === agora.dia);
    });

    if (!status) return;
    var aberto = agora.dia >= 2 && agora.dia <= 6 && agora.hora >= OPEN_HOUR && agora.hora < CLOSE_HOUR;

    if (aberto) {
      status.textContent = "Estamos abertos agora · fecha às 18:00";
      status.className = "status open";
    } else {
      status.textContent = "Fechado no momento · agende pelo WhatsApp para o próximo horário";
      status.className = "status closed";
    }
  }
  atualizarHorarios();
  setInterval(atualizarHorarios, 60 * 1000);

  // Animação de entrada ao rolar
  var itens = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observer.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });
    itens.forEach(function (el) { observer.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add("visible"); });
  }
})();