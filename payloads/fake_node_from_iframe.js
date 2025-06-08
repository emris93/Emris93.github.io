(() => {
  log("[*] fake_node_from_iframe – attempt to reuse a DOM element via iframe", "info");

  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  const fakeNode = iframe.contentWindow.document.createElement("div");

  // Structure diversion
  fakeNode.nodeType = 1;
  fakeNode.nodeName = "DIV";
  fakeNode.appendChild = () => log("[!] FAKE appendChild executed", "error");

  document.body.removeChild(iframe);
  log("[+] iframe removed – attempting to use the fake node", "info");

  try {
    document.body.appendChild(fakeNode);
    log("[✔] appendChild accepted (possible DOM injection leak)", "success");
  } catch (e) {
    log(`[!] DOM Exception: ${e.message}`, "error");
  }

  log("[✓] End of fake_node_from_iframe test", "info");
})();
