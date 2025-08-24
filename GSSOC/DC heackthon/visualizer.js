let audioContext, sourceNode, analyser, dataArray, bufferLength;
let sensitivity = 0.6;
let audioElement;

document.getElementById("sensitivity").oninput = (e) => {
  sensitivity = e.target.value;
  document.getElementById("sensitivityValue").textContent = sensitivity;
};

function playAudio() {
  const file = document.getElementById("audioFile").files[0];
  if (!file) return alert("Please upload a WAV file!");

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (!audioElement) {
    audioElement = new Audio(URL.createObjectURL(file));
    audioElement.crossOrigin = "anonymous";
    sourceNode = audioContext.createMediaElementSource(audioElement);
    analyser = audioContext.createAnalyser();
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    visualizeBeats();
  }
  audioElement.play();
}

function pauseAudio() {
  if (audioElement) audioElement.pause();
}

function stopAudio() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
}

function visualizeBeats() {
  requestAnimationFrame(visualizeBeats);
  analyser.getByteFrequencyData(dataArray);

  // Here you can later add real beat detection logic 
  // (e.g., highlight elements, visualize bars, etc.)
  let avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

  if (avg > 50 * sensitivity) {
    console.log("Beat Detected!");
  }
}


// Demo variables
let bpm = 156;
let beatsDetected = 13;
let energy = 0.0;

const bpmElement = document.getElementById("bpm");
const beatsElement = document.getElementById("beats");
const energyElement = document.getElementById("energy");
const beatCircle = document.getElementById("beatCircle");

// Simulated beat detection every 1 second
setInterval(() => {
  // Random values for demo (replace with real FFT audio values later)
  bpm = 120 + Math.floor(Math.random() * 60);  // 120 - 180 BPM
  energy = (Math.random() * 100).toFixed(1);   // 0 - 100 %
  beatsDetected++;

  // Update UI
  bpmElement.textContent = bpm;
  energyElement.textContent = energy + "%";
  beatsElement.textContent = beatsDetected;

  // Animate beat circle
  beatCircle.style.background = "red";
  beatCircle.style.transform = "scale(1.2)";
  setTimeout(() => {
    beatCircle.style.background = "darkred";
    beatCircle.style.transform = "scale(1)";
  }, 200);

}, 1000);
