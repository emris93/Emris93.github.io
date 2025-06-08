(() => {
  log("[*] iframe_fuzz — PS5 WebKit DOM heap fuzzer", "info");

  const HTML_PAYLOAD = `
    <!DOCTYPE html><html>
    <head>
      <style>
        body { background: black; color: #0f0; font-family: monospace; }
        div { animation: spin 1s infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    </head>
    <body>
      <div>${"💥".repeat(5000)}</div>
    </body>
    </html>
  `;

  const trackers = [];

  for (let i = 0; i < 300; i++) {
    try {
      const iframe = document.createElement("iframe");

      // Load payload via srcdoc
      iframe.setAttribute("srcdoc", HTML_PAYLOAD);

      iframe.style.cssText = `
        width: 10px; height: 10px;
        position: absolute;
        top: ${Math.random() * 1000}px;
        left: ${Math.random() * 1000}px;
      `;

      document.body.appendChild(iframe);

      // Keep a JS reference to test UAF after DOM removal
      trackers.push(iframe);

      // Quickly remove every second iframe
      if (i % 2 === 0) {
        document.body.removeChild(iframe);
      }

      if (i % 50 === 0) {
        log(`[+] Injected ${i}/300 iframes`, "info");
      }

    } catch (e) {
      log(`[!] Exception iframe[${i}] : ${e.message}`, "error");
    }
  }

  // Deferred read: test for UAF or corrupted memory access
  setTimeout(() => {
    log("[*] Post-removal read (UAF check)", "info");
    for (let i = 0; i < trackers.length; i++) {
      const iframe = trackers[i];
      try {
        const bodyText = iframe.contentDocument?.body?.textContent;
        if (!bodyText || bodyText.length < 10) {
          log(`[!] iframe[${i}] abnormal textContent`, "error");
        }
      } catch (e) {
        log(`[!] Exception reading iframe[${i}]: ${e.message}`, "error");
      }
    }
    log("[✓] End of iframe fuzz",
