const bpmElement = document.getElementById("bpm");
const beatsElement = document.getElementById("beats");
const energyElement = document.getElementById("energy");
const beatCircle = document.getElementById("beatCircle");

const audioFileInput = document.getElementById("audioFile");
const playBtn = document.querySelector(".play");
const pauseBtn = document.querySelector(".pause");
const stopBtn = document.querySelector(".stop");

let audioContext, source, analyser, dataArray, bufferLength;
let isPlaying = false;
let beatsDetected = 0;
let bpm = 0;

function setupAudio(file) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  const reader = new FileReader();
  reader.onload = (e) => {
    audioContext.decodeAudioData(e.target.result, (buffer) => {
      source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      source.start();
      isPlaying = true;
      detectBeats();
    });
  };
  reader.readAsArrayBuffer(file);
}

// Beat Detection Loop
function detectBeats() {
  if (!isPlaying) return;

  analyser.getByteFrequencyData(dataArray);

  let energy = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
  let energyPercent = (energy / 255 * 100).toFixed(1);

  if (energy > 120) { // Simple threshold
    beatsDetected++;
    beatCircle.style.background = "red";
    beatCircle.style.transform = "scale(1.2)";
    setTimeout(() => {
      beatCircle.style.background = "darkred";
      beatCircle.style.transform = "scale(1)";
    }, 150);
  }

  bpm = Math.floor(100 + Math.random() * 80); // Fake BPM for now

  // Update UI
  bpmElement.textContent = bpm;
  energyElement.textContent = energyPercent + "%";
  beatsElement.textContent = beatsDetected;

  requestAnimationFrame(detectBeats);
}

// Controls
playBtn.addEventListener("click", () => {
  if (audioFileInput.files.length > 0 && !isPlaying) {
    setupAudio(audioFileInput.files[0]);
  }
});

pauseBtn.addEventListener("click", () => {
  if (audioContext && audioContext.state === "running") {
    audioContext.suspend();
    isPlaying = false;
  }
});

stopBtn.addEventListener("click", () => {
  if (source) {
    source.stop();
    isPlaying = false;
    beatsDetected = 0;
    bpmElement.textContent = "0";
    beatsElement.textContent = "0";
    energyElement.textContent = "0.0%";
  }
});
