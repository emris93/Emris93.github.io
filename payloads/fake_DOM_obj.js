(() => {
  log("[*] fake_DOM_obj – tentative d’injection JS ressemblant à DOM", "info");

  const fakeDOM = {
    nodeType: 1,
    nodeName: "DIV",
    appendChild: function (c) {
      log("[!] FAKE appendChild() exécuté", "error");
    },
    toString: function () {
      return "[object HTMLElement]";
    }
  };

  try {
    document.body.appendChild(fakeDOM);
    log("[✔] fakeDOM passé à appendChild()", "success");
  } catch (e) {
    log(`[!] Exception DOM injection : ${e.message}`, "error");
  }

  log("[✓] Fin test fake_DOM_obj", "info");
})();
