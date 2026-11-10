/* Blossom & Barley – Bloom Together · interacties */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Navigatie: achtergrond bij scrollen + mobiel menu */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 20); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Elementen laten verschijnen bij scrollen */
  var items = document.querySelectorAll("[data-reveal], .film__frame");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Video: enkel afspelen als hij in beeld is + geluidsknop */
  var video = document.querySelector(".film video");
  var sound = document.querySelector(".sound");
  if (video) {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !reduce) { video.play().catch(function () {}); }
          else { video.pause(); }
        });
      }, { threshold: 0.35 }).observe(video);
    }
    if (sound) {
      sound.addEventListener("click", function () {
        var on = video.muted;
        video.muted = !on;
        sound.setAttribute("aria-pressed", on);
        sound.querySelector(".label").textContent = on ? "Sound off" : "Sound on";
        if (on) { video.currentTime = 0; video.play().catch(function () {}); }
      });
    }
  }

  /* Kleine parallax op de hero-illustratie (enkel met muis) */
  var stage = document.querySelector(".hero__stage");
  if (stage && !reduce && window.matchMedia("(pointer: fine)").matches) {
    var layers = stage.querySelectorAll("[data-depth]");
    stage.parentElement.addEventListener("mousemove", function (ev) {
      var r = stage.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5;
      var y = (ev.clientY - r.top) / r.height - 0.5;
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute("data-depth"));
        l.style.translate = (x * d) + "px " + (y * d) + "px";
      });
    });
  }

  /* Blaadjes laten vallen als iemand zich inschrijft */
  window.bbPetals = function (origin) {
    if (reduce) return;
    var colors = ["#FC7693", "#FBF3E1", "#FC411A", "#A86B94"];
    var r = origin.getBoundingClientRect();
    for (var i = 0; i < 28; i++) {
      var p = document.createElement("span");
      p.textContent = "✿";
      p.setAttribute("aria-hidden", "true");
      p.style.cssText = "position:fixed;z-index:300;pointer-events:none;font-size:" + (14 + Math.random() * 18) + "px;color:" +
        colors[i % colors.length] + ";left:" + (r.left + r.width / 2) + "px;top:" + (r.top + r.height / 2) + "px;";
      document.body.appendChild(p);
      var ang = Math.random() * Math.PI * 2, dist = 120 + Math.random() * 220;
      p.animate([
        { transform: "translate(0,0) rotate(0) scale(.4)", opacity: 1 },
        { transform: "translate(" + Math.cos(ang) * dist + "px," + (Math.sin(ang) * dist + 160) + "px) rotate(" + (Math.random() * 540) + "deg) scale(1)", opacity: 0 }
      ], { duration: 1400 + Math.random() * 700, easing: "cubic-bezier(.22,1,.36,1)" }).onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
  };

  /* Jaar in de footer */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
