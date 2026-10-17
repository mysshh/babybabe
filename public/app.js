const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const toast = $("#toast");
let toastTimer;
function say(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

$("#helloPip").addEventListener("click", () => say("Pip says: hiiiiii!! ✨ (then immediately yawns)"));
$("#modeToggle").addEventListener("click", (event) => {
  const active = document.body.classList.toggle("daydream");
  event.currentTarget.setAttribute("aria-pressed", String(active));
  event.currentTarget.textContent = active ? "☾ NIGHT MODE" : "☼ DAYDREAM";
  say(active ? "Morning, little dreamer ☀" : "Shhh... the stars are waking up 🌙");
});

let audioContext;
function chime(frequency = 660, duration = 0.34) {
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext ||= new Audio();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.075, audioContext.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.02);
  } catch (_) { /* Audio is an enhancement; the site still works without it. */ }
}
let lullabyPlaying = false;
$$("[data-action]").forEach((button) => button.addEventListener("click", () => {
  const action = button.dataset.action;
  if (action === "lullaby") {
    lullabyPlaying = !lullabyPlaying;
    button.innerHTML = lullabyPlaying ? "PAUSE THE LULLABY <span>Ⅱ</span>" : "TRY THE LULLABY <span>↗</span>";
    if (lullabyPlaying) {
      [523, 659, 784, 659, 587, 784].forEach((freq, i) => setTimeout(() => {
        if (lullabyPlaying) chime(freq, 0.45);
      }, i * 360));
      say("A tiny lullaby, made of little moon-notes ♫");
    } else say("Lullaby tucked in for a nap. zzz");
  }
  if (action === "light") {
    const visual = $(".lantern-visual");
    const lit = visual.classList.toggle("lit");
    button.innerHTML = lit ? "LET THE LAMP REST <span>↗</span>" : "TURN ON THE MAGIC <span>↗</span>";
    if (lit) chime(880, 0.55);
    say(lit ? "A little light for a little night ✨" : "Goodnight, tiny lantern ☾");
  }
  if (action === "route") {
    const mail = $(".mail-envelope");
    mail.animate([{transform:"translate(-70px,30px) rotate(-12deg)"},{transform:"translate(70px,-50px) rotate(12deg)"},{transform:"translate(0,0) rotate(0deg)"}], {duration:1100,easing:"ease-in-out"});
    chime(740, 0.28);
    say("Dream dispatched! ETA: one sleepy blink 💌");
  }
}));

const scenes = [
  {chapter:"CHAPTER 01 — THE LITTLE LIGHT",text:"One night, in a nursery tucked between the moon and the morning, a tiny light blinked awake. It was Pip. Nobody knew where the little dreamer came from — not even Pip. But there was a star on their cap, a yawn in their smile, and a very important feeling that somebody, somewhere, needed a good dream."},
  {chapter:"CHAPTER 02 — THE FIRST DELIVERY",text:"Pip folded a little wish into a paper envelope, tied it with a pink bow, and climbed onto the roof. The first delivery went to a fox who was afraid of thunder. Pip sent a dream of warm rain tapping on a window, and the fox slept until sunrise. Pip thought: oh. I can do this."},
  {chapter:"CHAPTER 03 — THE MIDNIGHT NURSERY",text:"Now Pip works the night shift at the Midnight Nursery. Lullabies in one pocket, tiny lanterns in the other, and a mailbag full of almost-impossible dreams. The work is small. The hours are late. But somewhere out there, a little creature is about to have a better night — and that's a very big thing."}
];
let sceneIndex = 0;
function renderScene() {
  const scene = scenes[sceneIndex];
  $("#storyChapter").textContent = scene.chapter;
  $("#storyText").textContent = scene.text;
  $("#storyCount").textContent = String(sceneIndex + 1).padStart(2, "0") + " / 03";
  $$(".story-dot").forEach((dot, i) => dot.classList.toggle("active", i === sceneIndex));
  $("#storyPrev").disabled = sceneIndex === 0;
  $("#storyNext").textContent = sceneIndex === scenes.length - 1 ? "READ AGAIN ↻" : "NEXT SCENE →";
}
$("#storyPrev").addEventListener("click", () => { if (sceneIndex > 0) sceneIndex--; renderScene(); });
$("#storyNext").addEventListener("click", () => { sceneIndex = (sceneIndex + 1) % scenes.length; renderScene(); });
$$("[data-wish]").forEach((button) => button.addEventListener("click", () => {
  $("#wishResponse").textContent = "✉ tucked safely in the mailbag: “" + button.dataset.wish + "”";
  chime(660, 0.3);
  say("Your little wish is packed with care ♡");
}));

let secretClicks = 0;
const secret = $("#secretStar");
function secretClick() {
  secretClicks++;
  if (secretClicks < 5) {
    secret.textContent = ["✦", "✧", "✦", "✧"][secretClicks % 4];
    say(["psst...","not yet, sleepyhead","one more little secret?","almost..."][secretClicks % 4]);
  } else {
    secret.textContent = "♡";
    secret.style.opacity = "1";
    secret.style.color = "#a34063";
    say("YOU FOUND PIP'S SECRET DREAM: you are someone's favourite plot twist ✨");
    chime(523); setTimeout(() => chime(659), 160); setTimeout(() => chime(784), 320);
    secret.removeEventListener("click", secretClick);
    secret.removeEventListener("keydown", secretKey);
  }
}
function secretKey(event) {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); secretClick(); }
}
secret.addEventListener("click", secretClick);
secret.addEventListener("keydown", secretKey);

renderScene();