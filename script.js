const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 600;

let baseImage = null;
let cloakImage = null;

// Upload character
document.getElementById("upload").addEventListener("change", (e) => {
  const reader = new FileReader();
  reader.onload = function(event) {
    baseImage = new Image();
    baseImage.onload = drawAll;
    baseImage.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Set cloak overlay
function setCloak(src) {
  cloakImage = new Image();
  cloakImage.onload = drawAll;
  cloakImage.src = src;
}

// Draw character + cloak
function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (baseImage) {
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  }
  if (cloakImage) {
    ctx.drawImage(cloakImage, 0, 0, canvas.width, canvas.height);
  }
}
