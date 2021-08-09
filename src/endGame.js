export default function end() {
  if(document.querySelector('.end-title')) return
  const endTitle = document.createElement("div");
  const glitch = document.createElement("div");
  const glow = document.createElement("div");
  const scanlines = document.createElement("div");
  document.body.appendChild(endTitle);
  endTitle.className = "end-title";
  glitch.className = "glitch";
  glitch.setAttribute("data-text", "GAME OVER");
  glitch.innerText = `GAME OVER`;
  glow.className = "glow";
  glow.innerText = `GAME OVER`;
  scanlines.className = "scanlines";
  endTitle.appendChild(glitch);
  endTitle.appendChild(glow);
  endTitle.appendChild(scanlines);
  endTitle.style.zIndex = "2";
}