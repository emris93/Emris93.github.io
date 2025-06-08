(() => {
  log("[*] read_ptr_via_proxy – simulation of memory read via hijacked proxy property", "info");

  const leakTarget = {
    leak: 0xdeadbeef
  };

  const proxy = new Proxy(leakTarget, {
    get: (target, prop) => {
      log(`[!] Property read "${prop}" intercepted`, "error");
      if (prop === "leak") return 0x1337beef;
      return target[prop];
    }
  });

  try {
    const val = proxy.leak;
    log(`[✔] proxy.leak read = 0x${val.toString(16)}`, "success");
  } catch (e) {
    log(`[!] Error reading proxy.leak: ${e.message}`, "error");
  }

  log("[✓] End of read_ptr_via_proxy test", "info");
})();
