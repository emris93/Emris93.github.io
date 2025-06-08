(() => {
  log("[*] fake_DOM_obj – attempt to inject JS resembling the DOM", "info");

  const fakeDOM = {
    nodeType: 1,
    nodeName: "DIV",
    appendChild: function (c) {
      log("[!] FAKE appendChild() executed", "error");
    },
    toString: function () {
      return "[object HTMLElement]";
    }
  };

  try {
    document.body.appendChild(fakeDOM);
    log("[✔] fakeDOM passed to appendChild()", "success");
  } catch (e) {
    log(`[!] DOM injection exception: ${e.message}`, "error");
  }

  log("[✓] End of fake_DOM_obj test", "info");
})();
