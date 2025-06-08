(() => {
  log("[*] fake_vtable_dom – simulation of a DOM object + trapped method", "info");

  // 🧠 Prototype simulating a DOM vtable
  const fakeDOMProto = {
    toString: function () {
      log("[!] FAKE toString executed — JS vtable intercepted", "error");
      return "[object HTMLDivElement]";
    },
    appendChild: function (x) {
      log("[!] FAKE appendChild on fake DOM executed", "error");
    },
    getAttribute: function (name) {
      log(`[!] getAttribute(${name}) intercepted`, "error");
      return "spoofed";
    },
    nodeType: 1,
    nodeName: "DIV"
  };

  // 💣 Fake DOM object
  const fakeDOM = {};
  Object.setPrototypeOf(fakeDOM, fakeDOMProto);

  // 🧪 Injection into a real DOM API
  try {
    const div = document.createElement("div");
    div.appendChild(fakeDOM);  // <- this may call native methods
    log("[✔] Injection of fakeDOM into appendChild() completed", "success");
  } catch (e) {
    log(`[!] Exception appendChild(fakeDOM): ${e.message}`, "error");
  }

  try {
    const attr = fakeDOM.getAttribute?.("id");
    if (attr) {
      log(`[✔] getAttribute returns: ${attr}`, "success");
    }
  } catch (e) {
    log(`[!] Exception getAttribute(): ${e.message}`, "error");
  }

  log("[✓] End of fake_vtable_dom test", "info");
})();
