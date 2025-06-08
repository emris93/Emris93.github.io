(() => {
  log("[*] instanceof_confuse – attempt to bypass instanceof using Symbol.hasInstance", "info");

  class FakeNode {
    static [Symbol.hasInstance](instance) {
      log("[!] Symbol.hasInstance intercepted", "error");
      return true;
    }
  }

  const fake = {};
  const result = fake instanceof FakeNode;

  log(`[✔] Result of instanceof FakeNode: ${result}`, "success");
  log("[✓] End of instanceof_confuse test", "info");
})();
