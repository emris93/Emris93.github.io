(() => {
  log("[*] fake_node_from_iframe – tentative de réutilisation d’un élément DOM via iframe", "info");

  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  const fakeNode = iframe.contentWindow.document.createElement("div");

  // Détournement de structure
  fakeNode.nodeType = 1;
  fakeNode.nodeName = "DIV";
  fakeNode.appendChild = () => log("[!] FAKE appendChild exécuté", "error");

  document.body.removeChild(iframe);
  log("[+] iframe supprimé – tentative d’utilisation du fake node", "info");

  try {
    document.body.appendChild(fakeNode);
    log("[✔] appendChild accepté (leak dom injection possible)", "success");
  } catch (e) {
    log(`[!] Exception DOM : ${e.message}`, "error");
  }

  log("[✓] Fin test fake_node_from_iframe", "info");
})();
