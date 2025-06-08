(() => {
  log("[*] iframe_msg_uaf — testing Use-After-Free via contentWindow.postMessage()", "info");

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

      // Remove shortly after injection
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 50 + Math.random() * 50);

    } catch (e) {
      log(`[!] Exception iframe ${i}: ${e.message}`, "error");
    }
  }

  // 🔁 Send postMessage after iframe removal (possible UAF)
  setTimeout(() => {
    log("[*] Attempting postMessage to removed iframes", "info");
    iframes.forEach((frame, i) => {
      try {
        frame.contentWindow.postMessage("PING" + i, "*");
        log(`[>] Message ${i} sent`, "info");
      } catch (e) {
        log(`[!] Potential UAF iframe[${i}] — ${e.message}`, "error");
      }
    });
    log("[✓] End of postMessage fuzz", "success");
  }, 500);
})();
