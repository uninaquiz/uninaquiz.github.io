export function spawnConfetti(): void {
  const colors = ["#00FF87", "#00ccff", "#ffb800", "#ff4d6d", "#ffffff"];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const c = document.createElement("div");
      c.style.cssText = `
        position:fixed;pointer-events:none;z-index:1000;border-radius:2px;
        left:${Math.random() * 100}vw;top:-20px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;
        animation:confettiFall ${1.5 + Math.random() * 2}s ${Math.random() * 0.5}s linear forwards;
        transform:rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }, i * 30);
  }
}
