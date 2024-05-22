const audioElement = document.querySelector("audio");

const playButton = document.querySelector(".player-play-btn");
const playIconHtml = document.querySelector(".player-icon-play");
const pauseIcon = document.querySelector(".player-icon-pause");
const progress = document.querySelector(".player-progress");
const progressFilled = document.querySelector(".player-progress-filled");
const currentTime = document.querySelector(".player-time-current");
const duration = document.querySelector(".player-time-duration");

const playBar = document.querySelector("#player");
const previousBtn = document.querySelector(".previous-btn");
const nextBtn = document.querySelector(".next-btn");
const searchInput = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
let mousedown = false;
const playlist = document.querySelector(".playlist");

window.addEventListener("load", () => {
   setTime();
   audioElement.addEventListener("timeupdate", () => {
      setTime();
      progressUpdate();
   });
   //song ended function
   audioElement.addEventListener("ended", () => {
      playButton.dataset.playing === "false";
      pauseIcon.classList.add("hidden");
      playIconHtml.classList.remove("hidden");
      progressFilled.style.flexBasis = "0%";
      audioElement.currentTime = 0;
      audioElement.duration = audioElement.duration;
   });
});
//När låt playas från playbar
playButton.addEventListener("click", () => {
   if (playButton.dataset.playing === "false") {
      playSong(audioElement);
   } else if (playButton.dataset.playing === "true") {
      pauseSong(audioElement);
   }
});

function playSong(audio) {
   audio.play();
   playButton.dataset.playing = "true";
   playIconHtml.classList.add("hidden");
   pauseIcon.classList.remove("hidden");
}

function pauseSong(audio) {
   audio.pause();
   playButton.dataset.playing = "false";
   playIconHtml.classList.remove("hidden");
   pauseIcon.classList.add("hidden");
}
const songs = [
   "songs/Danny Shields - Sunny Daydreams.mp3",
   "songs/Jozeque - Cozee Rooftop.mp3",
   "songs/Juvenile - Make Me Speak.mp3",
   "songs/NAEMS - Chatter.mp3",
   "songs/Tomer Ben Ari - Dependent.mp3",
];

//funktion för att spela nästa låt
function playNextSong() {}
//skapar en divlåda för varje song från songsarray
songs.forEach((song) => {
   let songElement = document.createElement("div");
   songElement.style.display = "flex";
   songElement.style.alignItems = "center";
   songElement.style.gap = "15px";
   songElement.style.marginTop = "6px";
   songElement.style.background = "#333";

   //på dubbelklick event spela låt från spellistan
   songElement.addEventListener("dblclick", function () {
      playBar.style.display = "block";
      audioElement.src = song;
      playSong(audioElement);
   });
   //Hover effekt på divlådan
   songElement.addEventListener("mouseenter", function () {
      songElement.style.backgroundColor = "#444";
   });
   songElement.addEventListener("mouseleave", function () {
      songElement.style.backgroundColor = "#333";
   });
   // split string för att visa enbart låtnamn och artist och placeras i ett span
   let songAndArtist = song.split("/")[1].replace(".mp3", "");
   let songArtist = songAndArtist.split(" - ")[0];
   let songName = songAndArtist.split(" - ")[1];
   let songNameSpan = document.createElement("span");
   songNameSpan.textContent = songName;

   let songArtistSpan = document.createElement("span");
   songArtistSpan.textContent = songArtist;
   songArtistSpan.style.fontSize = "15px";
   songArtistSpan.style.color = "#999";

   //playicon till spellistan
   let playIcon = document.createElement("img");
   playIcon.src = "images/3669295_ic_white_filled_play_circle_icon.png";
   playIcon.alt = "play";
   playIcon.style.width = "35px";
   playIcon.style.height = "35px";
   playIcon.style.paddingLeft = "10px";
   playIcon.style.paddingTop = "10px";
   playIcon.style.paddingBottom = "10px";

   songElement.appendChild(playIcon);
   songElement.appendChild(songNameSpan);
   songElement.appendChild(songArtistSpan);
   playlist.appendChild(songElement);
});

//uppdaterar låtens tid
function setTime() {
   const newCurrentTime = new Date(audioElement.currentTime * 1000);
   const newDuration = new Date(audioElement.duration * 1000);

   currentTime.textContent =
      newCurrentTime.getMinutes() + ":" + newCurrentTime.getSeconds();
   duration.textContent =
      newDuration.getMinutes() + ":" + newDuration.getSeconds();
}
//funktion till spelarens progresslinje
function progressUpdate() {
   const percent = (audioElement.currentTime / audioElement.duration) * 100;
   progressFilled.style.flexBasis = `${percent}%`;
}

//funktion för när man drar längst tidslinjen
function scrub(event) {
   const scrubTime =
      (event.offsetX / progress.offsetWidth) * audioElement.duration;
   audioElement.currentTime = scrubTime;
}
progress.addEventListener("click", scrub);
{
   progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
   progress.addEventListener("mousedown", () => (mousedown = true));
   progress.addEventListener("mouseup", () => (mousedown = false));
}
