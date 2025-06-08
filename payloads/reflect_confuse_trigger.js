(() => {
  log("[*] reflect_confuse_trigger – manipulation of Reflect on a hijacked prototype", "info");

  const target = {};
  const fakeProto = {
    get test() {
      log("[!] GET intercepted via Reflect", "error");
      return 1234;
    }
  };

  Object.setPrototypeOf(target, fakeProto);

  try {
    const val = Reflect.get(target, "test");
    log(`[✔] Reflect.get returns: ${val}`, "success");
  } catch (e) {
    log(`[!] Exception Reflect.get: ${e.message}`, "error");
  }

  log("[✓] End of reflect_confuse_trigger test", "info");
})();
