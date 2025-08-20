const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const uploadAvatar = document.getElementById("uploadAvatar");
const cloakOptions = document.getElementById("cloakOptions");
const downloadBtn = document.getElementById("downloadBtn");

let avatarImg = null;
let cloakImg = null;

// cloak position & size
let cloakX = 50, cloakY = 50, cloakW = 300, cloakH = 300;
let dragging = false;
let resizing = false;
const handleSize = 20; // resize handle size

// Load cloaks dynamically
const cloaks = ["cloak1.png", "cloak2.png", "cloak3.png"];
cloaks.forEach(src => {
  const img = document.createElement("img");
  img.src = `cloaks/${src}`;
  img.alt = src;
  img.addEventListener("click", () => {
    cloakImg = new Image();
    cloakImg.src = img.src;
    cloakImg.onload = () => {
      cloakX = 50;
      cloakY = 50;
      cloakW = 300;
      cloakH = 300;
      drawCanvas();
    };
  });
  cloakOptions.appendChild(img);
});

// Handle avatar upload
uploadAvatar.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    avatarImg = new Image();
    avatarImg.src = event.target.result;
    avatarImg.onload = drawCanvas;
  };
  reader.readAsDataURL(file);
});

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (avatarImg) {
    ctx.drawImage(avatarImg, 0, 0, canvas.width, canvas.height);
  }

  if (cloakImg) {
    ctx.drawImage(cloakImg, cloakX, cloakY, cloakW, cloakH);

    // draw resize handle (bottom-right corner)
    ctx.fillStyle = "rgba(255, 255, 0, 0.6)";
    ctx.fillRect(cloakX + cloakW - handleSize, cloakY + cloakH - handleSize, handleSize, handleSize);
  }
}

// Mouse/touch drag logic
function isInCloak(x, y) {
  return x > cloakX && x < cloakX + cloakW && y > cloakY && y < cloakY + cloakH;
}
function isInHandle(x, y) {
  return x > cloakX + cloakW - handleSize && x < cloakX + cloakW &&
         y > cloakY + cloakH - handleSize && y < cloakY + cloakH;
}

let offsetX, offsetY;

function startDrag(x, y) {
  if (!cloakImg) return;
  if (isInHandle(x, y)) {
    resizing = true;
  } else if (isInCloak(x, y)) {
    dragging = true;
    offsetX = x - cloakX;
    offsetY = y - cloakY;
  }
}

function drag(x, y) {
  if (dragging) {
    cloakX = x - offsetX;
    cloakY = y - offsetY;
    drawCanvas();
  }
  if (resizing) {
    cloakW = Math.max(50, x - cloakX);
    cloakH = Math.max(50, y - cloakY);
    drawCanvas();
  }
}

function endDrag() {
  dragging = false;
  resizing = false;
}

// Mouse events
canvas.addEventListener("mousedown", e => startDrag(e.offsetX, e.offsetY));
canvas.addEventListener("mousemove", e => drag(e.offsetX, e.offsetY));
canvas.addEventListener("mouseup", endDrag);

// Touch events (mobile)
canvas.addEventListener("touchstart", e => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  startDrag(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener("touchmove", e => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  drag(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener("touchend", endDrag);

// Download
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "cloaked-avatar.png";
  link.href = canvas.toDataURL();
  link.click();
});
