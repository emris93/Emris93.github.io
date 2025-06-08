(() => {
  log("[*] reflect_confuse_trigger – manipulation Reflect sur prototype détourné", "info");

  const target = {};
  const fakeProto = {
    get test() {
      log("[!] GET intercepté via Reflect", "error");
      return 1234;
    }
  };

  Object.setPrototypeOf(target, fakeProto);

  try {
    const val = Reflect.get(target, "test");
    log(`[✔] Reflect.get retourne : ${val}`, "success");
  } catch (e) {
    log(`[!] Exception Reflect.get : ${e.message}`, "error");
  }

  log("[✓] Fin test reflect_confuse_trigger", "info");
})();
