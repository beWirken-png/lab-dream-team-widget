/* =====================================================================
   beWirken lab · Dream-Team Matcher – Einbettungs-Loader (embed.js)

   Auf eurem GitHub-Pages-Repo neben dream-team-matcher.iframe.html ablegen.
   In WordPress/Elementor ("Individuelles HTML") genügt dann EINE Zeile:

     <script src="https://bewirken-png.github.io/lab-dream-team-widget/embed.js"></script>

   Diese Datei erzeugt das schwebende iframe und passt seine Größe an:
   kompakte Teaser-Box rechts, Vollbild beim Öffnen des Pop-ups.
   ===================================================================== */
(function () {
  "use strict";

  // Eigene URL ermitteln -> die Widget-Datei liegt im selben Ordner.
  var me = document.currentScript ||
    (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var base = (me && me.src) ? me.src.replace(/[^/]*$/, "") : "";

  // Dateiname der Widget-Seite im selben Ordner.
  //  • "index.html" -> euer Setup (Widget liegt als index.html im Repo)
  //  • sonst         -> exakter Dateiname, z. B. "dream-team-matcher.iframe.html"
  var FILE = "index.html";
  var SRC = base + FILE;

  var SIZES = {
    teaser: { w: "330px", h: "412px" }, // komplette Blüte (Bubble + Themen-Strahlen)
    open:   { w: "100vw", h: "100vh" }   // Pop-up = Vollbild
  };
  var SHOW_FROM = 0.10, SHOW_TO = 0.90; // Teaser nur in den mittleren 80% der Seite

  function build() {
    if (document.getElementById("bwm-embed-frame")) return; // nur einmal

    var f = document.createElement("iframe");
    f.id = "bwm-embed-frame";
    f.src = SRC;
    f.title = "beWirken lab Dream-Team Matcher";
    f.setAttribute("allowtransparency", "true");
    f.allow = "clipboard-write";
    f.style.cssText =
      "position:fixed;border:0;background:transparent;z-index:2147483000;" +
      "right:0;top:50%;transform:translateY(-50%);width:330px;height:412px;opacity:0;" +
      "transition:opacity .3s ease;";

    var frameState = "teaser"; // "teaser" | "open" (vom Widget gemeldet)

    function place(state) {
      var s = SIZES[state] || SIZES.teaser;
      f.style.width = s.w; f.style.height = s.h;
      if (state === "open") { f.style.top = "0"; f.style.right = "0"; f.style.transform = "none"; }
      else { f.style.top = "50%"; f.style.right = "0"; f.style.transform = "translateY(-50%)"; }
    }
    function inBand() {
      var doc = document.documentElement;
      var max = (document.body.scrollHeight || doc.scrollHeight) - window.innerHeight;
      if (max <= 0) return true; // kurze Seite -> immer zeigen
      var p = (window.scrollY || doc.scrollTop) / max;
      return p >= SHOW_FROM && p <= SHOW_TO;
    }
    function render() {
      if (frameState === "open") { place("open"); f.style.opacity = "1"; f.style.pointerEvents = "auto"; return; }
      place("teaser");
      if (inBand()) { f.style.opacity = "1"; f.style.pointerEvents = "auto"; }
      else { f.style.opacity = "0"; f.style.pointerEvents = "none"; }
    }

    window.addEventListener("message", function (e) {
      var d = e.data;
      if (!d || d.__bwmFrame !== 1) return;
      frameState = d.state; render();
    });
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);

    document.body.appendChild(f);
    render();
  }

  if (document.body) { build(); }
  else { document.addEventListener("DOMContentLoaded", build); }
})();
