(() => {
  log("[*] instanceof_confuse – tentative de bypass de instanceof via Symbol.hasInstance", "info");

  class FakeNode {
    static [Symbol.hasInstance](instance) {
      log("[!] Symbol.hasInstance intercepté", "error");
      return true;
    }
  }

  const fake = {};
  const result = fake instanceof FakeNode;

  log(`[✔] Résultat instanceof FakeNode: ${result}`, "success");
  log("[✓] Fin test instanceof_confuse", "info");
})();
