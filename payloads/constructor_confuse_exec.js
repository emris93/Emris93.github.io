(() => {
  log("[*] constructor_confuse_exec_fixed – __proto__ diverted for prototype confusion", "info");

  const fakeProto = {
    toString: function () {
      log("[!] FAKE prototype toString() executed", "error");
      return "[confused]";
    },
    valueOf: function () {
      log("[!] FAKE prototype valueOf() executed", "error");
      return 1337;
    }
  };

  const obj = { marker: 0x1337 };
  obj.__proto__ = fakeProto;

  try {
    const t = obj.toString();
    log(`[✔] Result of toString(): ${t}`, "success");
  } catch (e) {
    log(`[!] Exception toString(): ${e.message}`, "error");
  }

  try {
    const v = obj + 1;
    log(`[✔] Result of obj + 1: ${v}`, "success");
  } catch (e) {
    log(`[!] Exception valueOf(): ${e.message}`, "error");
  }

  log("[✓] test ending constructor_confuse_exec_fixed", "info");
})();
