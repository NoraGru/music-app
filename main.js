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
const songArtistInfo = document.querySelector(".song-Playing-Info");

window.addEventListener("load", () => {
   setTime();
   songs.forEach((song) => {
      let songElement = createSongElement(song);
      playlist.appendChild(songElement);
   });
   audioElement.addEventListener("timeupdate", () => {
      setTime();
      progressUpdate();
   });
});
//När låt playas från playbar
playButton.addEventListener("click", () => {
   if (playButton.dataset.playing === "false") {
      playSong(audioElement);
   } else if (playButton.dataset.playing === "true") {
      pauseSong(audioElement);
   }
   getCurrentSongInfo();
});
audioElement.addEventListener("ended", () => {
   playNextSong();
   getCurrentSongInfo();
});
function playSong(audio) {
   audioElement.play();
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
   "Danny Shields - Sunny Daydreams",
   "Jozeque - Cozee Rooftop",
   "Juvenile - Make Me Speak",
   "NAEMS - Chatter",
   "Tomer Ben Ari - Dependent",
];

let songIndex = 0;

// laddar in songs array första låt när sidan öppnas.
function loadSong(song) {
   return `songs/${song}.mp3`;
}
window.addEventListener("load", () => {
   audioElement.src = loadSong(songs[0]);
});

function playNextSong() {
   if (songIndex < songs.length - 1) {
      songIndex++;
   } else {
      songIndex = 0;
   }
   audioElement.src = loadSong(songs[songIndex]);
   playSong();
}
nextBtn.addEventListener("click", () => {
   playNextSong();
   getCurrentSongInfo();
});
function playPreviousSong() {
   if (songIndex > 0) {
      songIndex--;
   } else {
      songIndex = songs.length - 1;
   }
   audioElement.src = loadSong(songs[songIndex]);
   playSong();
}
previousBtn.addEventListener("click", () => {
   playPreviousSong();
   getCurrentSongInfo();
});
//hämtar låt och song information från audioElement för att visa i playbar.
function getCurrentSongInfo() {
   const foundSong = decodeURIComponent(audioElement.src);

   const songArtist = foundSong.split("/").pop().split("-")[0].trim();
   const songName = foundSong.split("/").pop().split("-")[1].split(".")[0];

   songArtistInfo.textContent = `${songArtist} - ${songName}`;
   songArtistInfo.style.fontSize = "14px";
   songArtistInfo.style.color = "#999";
}

//sök efter låt.
const searchSong = (value) => {
   return songs.filter((song) =>
      song.toLowerCase().includes(value.toLowerCase())
   );
};

function searchAndDisplaySongs(searchTerm) {
   playlist.innerHTML = "";
   const matchingSongs = searchSong(searchTerm);

   matchingSongs.forEach((song) => {
      const songElement = createSongElement(song);
      playlist.appendChild(songElement);
   });
}
searchInput.addEventListener("input", () => {
   const searchTerm = searchInput.value;

   searchAndDisplaySongs(searchTerm);
});

//skapar en funktion som skapar en låt för varje funnen song
function createSongElement(song) {
   let songElement = document.createElement("div");
   songElement.style.display = "flex";
   songElement.style.alignItems = "center";
   songElement.style.gap = "15px";
   songElement.style.marginTop = "6px";
   songElement.style.background = "#333";

   //Hover effekt på divlådan
   songElement.addEventListener("mouseenter", function () {
      songElement.style.backgroundColor = "#444";
   });
   songElement.addEventListener("mouseleave", function () {
      songElement.style.backgroundColor = "#333";
   });

   //förser songElement med information om låt och artist
   let artist = song.split(" - ")[0];
   let songName = song.split(" - ")[1];
   let songNameSpan = document.createElement("span");
   songNameSpan.textContent = songName;

   let ArtistSpan = document.createElement("span");
   ArtistSpan.textContent = artist;
   ArtistSpan.style.fontSize = "15px";
   ArtistSpan.style.color = "#999";
   ArtistSpan.style.webkitTapHighlightColor = "rgba(225,225,225, 0)"; // får inte att fungera

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
   songElement.appendChild(ArtistSpan);

   songElement.addEventListener("dblclick", function () {
      playBar.style.display = "block";
      audioElement.src = loadSong(song);
      playSong(audioElement);
      getCurrentSongInfo();
   });
   return songElement;
} // hittar songElement inuti createSongElement() funktionen för att avgöra när event dblclick ska verkställas
playlist.addEventListener("dblclick", function (event) {
   if (event.target.classList.contains("songElement")) {
      audioElement.src = loadSong(song);
      playSong(audioElement);
      getCurrentSongInfo();
   }
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
   progressFilled.style.flexBasis = `{percent}%`;
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
