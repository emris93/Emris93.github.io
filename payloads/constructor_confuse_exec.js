(() => {
  log("[*] constructor_confuse_exec_fixed – __proto__ détourné pour confusion prototype", "info");

  const fakeProto = {
    toString: function () {
      log("[!] FAKE prototype toString() exécuté", "error");
      return "[confused]";
    },
    valueOf: function () {
      log("[!] FAKE prototype valueOf() exécuté", "error");
      return 1337;
    }
  };

  const obj = { marker: 0x1337 };
  obj.__proto__ = fakeProto; // 🧬 override réel du prototype

  try {
    const t = obj.toString();
    log(`[✔] Résultat toString(): ${t}`, "success");
  } catch (e) {
    log(`[!] Exception toString(): ${e.message}`, "error");
  }

  try {
    const v = obj + 1;
    log(`[✔] Résultat obj + 1: ${v}`, "success");
  } catch (e) {
    log(`[!] Exception valueOf(): ${e.message}`, "error");
  }

  log("[✓] Fin test constructor_confuse_exec_fixed", "info");
})();
