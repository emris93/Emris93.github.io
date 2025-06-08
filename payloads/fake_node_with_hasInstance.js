(() => {
  log("[*] fake_node_with_hasInstance – falsifying instanceof Node via Symbol.hasInstance", "info");

  // 🔧 Hijacked prototype with DOM-like methods
  const fakeProto = {
    toString: function () {
      log("[!] FAKE toString executed", "error");
      return "[object HTMLDivElement]";
    },
    getAttribute: function (name) {
      log(`[!] getAttribute(${name}) intercepted`, "error");
      return "spoofed";
    },
    nodeType: 1,
    nodeName: "DIV"
  };

  // ✅ Class with Symbol.hasInstance → always returns true
  class FakeNode {
    static [Symbol.hasInstance](instance) {
      log("[!] Symbol.hasInstance intercepted – returning true", "error");
      return true;
    }
  }

  // 🧱 Raw JS object with a DOM-like prototype
  const fakeDOM = {};
  Object.setPrototypeOf(fakeDOM, fakeProto);

  // 🔁 Assign constructor with Symbol.hasInstance
  fakeDOM.constructor = FakeNode;

  // 🧪 Test instanceof
  if (fakeDOM instanceof Node) {
    log("[✔] fakeDOM recognized as instance of Node (bypass successful)", "success");
  } else {
    log("[✘] Bypass of instanceof Node failed", "error");
  }

  // 🧪 Test appendChild if bypass is successful
  try {
    const div = document.createElement("div");
    div.appendChild(fakeDOM);
    log("[✔] fakeDOM injected using appendChild()", "success");
  } catch (e) {
    log(`[!] appendChild() failed: ${e.message}`, "error");
  }

  log("[✓] End of fake_node_with_hasInstance test", "info");
})();
