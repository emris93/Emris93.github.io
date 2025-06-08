(() => {
  log("[*] fakeobj_from_constructor – attempt to hijack .constructor", "info");

  const obj = { marker: 0x1337 };
  const originalCtor = obj.constructor;

  try {
    Object.defineProperty(obj, 'constructor', {
      get: () => {
        log("[!] constructor intercepted!", "error");
        return function FAKE() {};
      },
      configurable: true
    });

    const test = obj.constructor.name;
    log(`[✔] Constructor name after hijacking: ${test}`, "success");
  } catch (e) {
    log(`[!] Exception .constructor: ${e.message}`, "error");
  }

  log("[✓] End of fakeobj_from_constructor test", "info");
})();
