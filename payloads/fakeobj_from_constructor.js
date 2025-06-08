(() => {
  log("[*] fakeobj_from_constructor – tentative de détournement de .constructor", "info");

  const obj = { marker: 0x1337 };
  const originalCtor = obj.constructor;

  try {
    Object.defineProperty(obj, 'constructor', {
      get: () => {
        log("[!] interception de constructor!", "error");
        return function FAKE() {};
      },
      configurable: true
    });

    const test = obj.constructor.name;
    log(`[✔] Nom du constructeur post-détournement : ${test}`, "success");
  } catch (e) {
    log(`[!] Exception .constructor: ${e.message}`, "error");
  }

  log("[✓] Fin test fakeobj_from_constructor", "info");
})();
