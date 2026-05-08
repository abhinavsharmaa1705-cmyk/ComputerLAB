const target = document.querySelector("#target");
const pcWrapper = document.querySelector("#model-wrapper");
const partsWrapper = document.querySelector("#model-wrapper1");
const bgdiv = document.getElementById('ar-bg');
const backBtn = document.querySelector("#backBtn");
const credit = document.querySelector("#credit");



let isTargetFound = false;
let hasDragged = false;
let dragThreshold = 5;
let isPinching = false;
let gestureMoved = false;
let buttonClicked = false;
backBtn.addEventListener("click", () => {
buttonClicked=true;
});

AFRAME.registerComponent('lock-rotation', {
  tick: function () {
    const parent = this.el.parentEl;
    if (!parent) return;

    const parentRot = parent.getAttribute('rotation');

    // Cancel parent's rotation
    this.el.setAttribute('rotation', {
      x: -parentRot.x,
      y: -parentRot.y,
      z: -parentRot.z
    });
  }
});


target.addEventListener("targetFound", () => {
  isTargetFound = true;
  bgdiv.classList.add('ar-bg');

  pcWrapper.setAttribute("visible", true);
  partsWrapper.setAttribute("visible", false);
   backBtn.style.display = "none"; 
   credit.style.display = "none";
  toggleSpeech()
});

target.addEventListener("targetLost", () => {
  isTargetFound = false;
  bgdiv.classList.remove('ar-bg');

  pcWrapper.setAttribute("visible", false);
  partsWrapper.setAttribute("visible", false);
   backBtn.style.display = "none"; 
      credit.style.display = "none"; 

  toggleSpeech()
});
function handleTap() {
  if (!isTargetFound) return;
  
  if (hasDragged || gestureMoved || isPinching) {
    hasDragged = false;
    isPinching = false;
    gestureMoved = false;
    return;
  }

  const isPcVisible = pcWrapper.getAttribute("visible") == true;
  if (isPcVisible) {
    pcWrapper.setAttribute("visible", !isPcVisible);
    partsWrapper.setAttribute("visible", isPcVisible);
     backBtn.style.display = "block";
          credit.style.display = "block";

    speakText()
  }
  else if(buttonClicked)
  {
        pcWrapper.setAttribute("visible",true);
    partsWrapper.setAttribute("visible", false);
     backBtn.style.display = "none";
          credit.style.display = "none";

       toggleSpeech()


  }
}

window.addEventListener("touchend", handleTap);
window.addEventListener("click", handleTap);
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Interaction Settings
const rotationSpeed = 0.5;
const moveSpeed = 0.01;

// Listeners for Mouse and Touch
const startAction = (x, y) => {
  isDragging = true;
  hasDragged = false;
  isPinching = false;
  gestureMoved = false;
  previousMouseX = x;
  previousMouseY = y;
};

const endAction = () => {
  isDragging = false;
  initialDistance: null;
};

const moveAction = (x, y) => {
  if (!isDragging || !pcWrapper.getAttribute("visible")) return;

  const deltaX = x - previousMouseX;
  const deltaY = y - previousMouseY;
  const dxTotal = Math.abs(x - previousMouseX);
  const dyTotal = Math.abs(y - previousMouseY);

  if (dxTotal > dragThreshold || dyTotal > dragThreshold) {
    hasDragged = true;
  }

  // ROTATE logic (X and Y axes)
  const rotation = pcWrapper.getAttribute("rotation");
  rotation.y += deltaX * rotationSpeed; // Left/Right
  rotation.x += deltaY * rotationSpeed; // Up/Down
  pcWrapper.setAttribute("rotation", rotation);
  previousMouseX = x;
  previousMouseY = y;
};

window.addEventListener("mousedown", (e) => startAction(e.clientX, e.clientY));

window.addEventListener("mouseup", endAction);
window.addEventListener("mousemove", (e) => {
  moveAction(e.clientX, e.clientY);
});

// Mobile Touch Events
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startAction(e.touches[0].clientX, e.touches[0].clientY);
  }
});

const MIN_SCALE = 0.1;
const MAX_SCALE = 2;

let currentScale = 0.3;
pcWrapper.setAttribute(
  "scale",
  `${currentScale} ${currentScale} ${currentScale}`,
);
partsWrapper.setAttribute(
  "scale",
  `${currentScale} ${currentScale} ${currentScale}`,
);

function applyScale() {
  currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale));
  const isPcVisible = pcWrapper.getAttribute("visible") == true;
  if (isPcVisible) {
    pcWrapper.setAttribute(
      "scale",
      `${currentScale} ${currentScale} ${currentScale}`,
    );
  } else {
    partsWrapper.setAttribute(
      "scale",
      `${currentScale} ${currentScale} ${currentScale}`,
    );
  }
}

// -------------------- MOUSE WHEEL ZOOM --------------------
window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    currentScale -= e.deltaY * zoomSpeed;

    applyScale();
  },
  { passive: false },
);

let initialDistance = null;

function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

window.addEventListener("touchmove", (e) => {
  isPinching = true;
  gestureMoved = true;

  if (e.touches.length === 1) {
    moveAction(e.touches[0].clientX, e.touches[0].clientY);
  }

  

  // ---------------- TWO FINGERS → ZOOM (PINCH) ----------------
  else if (e.touches.length === 2) {
    const distance = getDistance(e.touches);

    if (initialDistance === null) {
      initialDistance = distance;
      return;
    }

    const diff = distance - initialDistance;

    currentScale += diff * 0.002;
    applyScale();

    initialDistance = distance;
  }
});
let voices = [];

speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};


 const speakText = () => {
  speechSynthesis.cancel();
    const text = "CPU (Central Processing Unit)\nThe brain of the computer 🧠\nExecutes instructions, performs calculations, and controls all operations.\nKey parts:\n• A L U (math & logic)\n• Control Unit\n• Registers\n\nSSD (Solid State Drive)\n(Secondary Memory)\nPermanent storage 💾\nStores OS, apps, and files with high speed.\nInside:\n• Flash memory\n• Controller\n\nGPU (Graphics Processing Unit)\nThe computer’s artist 🎮\nIt makes everything you see look smooth and real.\nWhat it does:\n• Shows images, videos, and games\n• Handles many tasks at once\nInside:\n• Lots of small cores\n• VRAM (video memory)\n\nMotherboard\nThe system’s central hub .It connects all components and controls how they interact. \n • Supports communication between CPU, RAM, and storage \n • Coordinates data transfer  \n• Powers and integrates all hardware\n\nRAM (Random Access Memory)\nShort-term memory ⚡\nStores active data for fast access.\nFeatures:\n• Very fast\n• Volatile (data lost when off)"

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;      // speed (0.5 - 2)
    speech.pitch = 1.2;     // voice pitch
    speech.volume = 1;    // volume


      let femaleVoice =
    voices.find(v => v.name.toLowerCase().includes("female")) ||
    voices.find(v => v.name.toLowerCase().includes("zira")) ||   // Windows female
    voices.find(v => v.name.toLowerCase().includes("samantha")) || // Mac female
    voices.find(v => v.name.toLowerCase().includes("google us english")) ||
    voices[0]; // fallback

  speech.voice = femaleVoice;

  speechSynthesis.speak(speech);
  };


  const toggleSpeech = () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }}