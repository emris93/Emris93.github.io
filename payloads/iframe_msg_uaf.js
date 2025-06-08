(() => {
  log("[*] iframe_msg_uaf — test de Use-After-Free via contentWindow.postMessage()", "info");

  const HTML_PAYLOAD = `
    <!DOCTYPE html><html><body>
      <script>
        window.addEventListener("message", function(e) {
          document.body.innerHTML = "[RECEIVED]";
        });
      </script>
    </body></html>
  `;

  const MAX = 200;
  const iframes = [];

  for (let i = 0; i < MAX; i++) {
    try {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("srcdoc", HTML_PAYLOAD);

      iframe.style.cssText = `
        width: 1px; height: 1px;
        position: absolute;
        top: ${Math.random() * 1000}px;
        left: ${Math.random() * 1000}px;
      `;

      document.body.appendChild(iframe);
      iframes.push(iframe);

      // Supprimer après courte durée
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 50 + Math.random() * 50);

    } catch (e) {
      log(`[!] Exception iframe ${i}: ${e.message}`, "error");
    }
  }

  // 🔁 Envoi postMessage après suppression (UAF possible)
  setTimeout(() => {
    log("[*] Tentative de postMessage vers iframes supprimés", "info");
    iframes.forEach((frame, i) => {
      try {
        frame.contentWindow.postMessage("PING" + i, "*");
        log(`[>] Message ${i} envoyé`, "info");
      } catch (e) {
        log(`[!] UAF potentiel iframe[${i}] — ${e.message}`, "error");
      }
    });
    log("[✓] Fin postMessage fuzz", "success");
  }, 500);
})();
