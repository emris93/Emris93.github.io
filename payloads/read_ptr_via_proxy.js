(() => {
  log("[*] read_ptr_via_proxy – simulation de lecture via propriété proxy détournée", "info");

  const leakTarget = {
    leak: 0xdeadbeef
  };

  const proxy = new Proxy(leakTarget, {
    get: (target, prop) => {
      log(`[!] Lecture de propriété "${prop}" interceptée`, "error");
      if (prop === "leak") return 0x1337beef;
      return target[prop];
    }
  });

  try {
    const val = proxy.leak;
    log(`[✔] Lecture proxy.leak = 0x${val.toString(16)}`, "success");
  } catch (e) {
    log(`[!] Erreur lecture proxy.leak : ${e.message}`, "error");
  }

  log("[✓] Fin test read_ptr_via_proxy", "info");
})();
