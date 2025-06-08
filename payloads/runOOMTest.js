(function runOOMTest() {
  console.log("[OOM] Executing forced memory exhaustion...");

  if (!window.__OOM) window.__OOM = [];

  try {
    while (true) {
      const buf = new ArrayBuffer(4 * 1024 * 1024); // 4MB
      window.__OOM.push(buf);
      if (window.__OOM.length % 64 === 0) {
        console.log(`[OOM] Allocated ~${window.__OOM.length * 4} MB`);
      }
    }
  } catch (e) {
    console.error("[OOM] Memory limit reached:", e.message);
    alert("💥 HARD OOM Triggered: " + e.message);
  }
})();
