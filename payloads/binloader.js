(() => {
  log("[*] binloader.js – chargement de payload .bin dans un buffer JS", "info");

  const BIN_PATH = "payloads/payload.bin"; // change si besoin

  fetch(BIN_PATH)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.arrayBuffer();
    })
    .then(buffer => {
      const bytes = new Uint8Array(buffer);
      log(`[✔] .bin chargé (${bytes.length} octets)`, "success");

      // 🧪 Affichage des premiers octets
      const hexPreview = Array.from(bytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(" ");
      log(`[→] Premier 16 octets : ${hexPreview}`, "info");

      // 🔥 Exemple : injecter dans un autre buffer
      // const sprayBuf = new Uint8Array(0x10000);
      // sprayBuf.set(bytes, 0);

      // 👇 expose le buffer globalement
      window.payload_bin = bytes;
      log("[✓] payload_bin exposé dans window.payload_bin", "success");
    })
    .catch(e => {
      log(`[!] Erreur chargement .bin : ${e.message}`, "error");
    });
})();
