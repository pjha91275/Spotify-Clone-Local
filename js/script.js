console.log("Lets write Javascript");

let currentSong = new Audio();
let songs;
let currFolder;

function formatSecondsToMinutes(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const formattedMins = String(mins).padStart(2, "0");
  const formattedSecs = String(secs).padStart(2, "0");

  return `${formattedMins}:${formattedSecs}`;
}

async function getSongs(folder) {
  currFolder = folder;
  console.log(currFolder);
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3.preview")) {
      songs.push(element.href.split(`/${folder}/`)[1].replace(".preview", ""));
    }
  }

  // show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class = "invert" src = "img/music.svg" alt = "">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Prince</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class = "invert" src = "img/play.svg" alt = "">
                </div></li>`;
  }

  //Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "0:0/0:0";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors).slice(3);
  console.log(array);
  console.log(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs")) {
      console.log(e);
      let folder = e.href.split("/").slice(-3)[0];
      //Get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML = cardContainer.innerHTML +
        `<div data-folder = "${folder}" class="card">
              <div class="play">
                <div class ="playButton">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="black" >
                <polygon points="8,5 8,19 19,12" />
                </svg>
                </div>
              </div>

              <img src="/songs/${folder}/cover.jpg" alt = "">
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`;
    }
  }

  //load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}

async function main() {
  //Get the list of all songs
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  //Display the albums on the page
  displayAlbums();

  //Attach an event listener to play ,prrevious & next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    const currentTime = Math.floor(currentSong.currentTime);
    const duration = Math.floor(currentSong.duration || 0);
    document.querySelector(".songTime").innerHTML = `${formatSecondsToMinutes(
      currentTime
    )} / ${formatSecondsToMinutes(duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
}

main();

//add event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});

//add event listener for close
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
});

//add event listener to previous
previous.addEventListener("click", () => {
  currentSong.pause();
  console.log("Next clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index - 1 >= 0) {
    playMusic(songs[index - 1]);
  }
});

//add event listener to next
next.addEventListener("click", () => {
  currentSong.pause();
  console.log("Next clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  console.log(index);
  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
  }
});

//add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
    if(currentSong.volume>0){
       document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("mute.svg","volume.svg") ;
    }
  });

//add an event listener to mute the volume
document.querySelector(".volume > img").addEventListener("click", e => {
  console.log(e.target);
  if (e.target.src.includes("volume.svg")) {
    e.target.src = e.target.src.replace("volume.svg","mute.svg") ;
    currentSong.volume = 0;
    console.log(currentSong.volume)
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0 ;
  }
  else {
    e.target.src = e.target.src.replace("mute.svg","volume.svg") ;
    currentSong.volume = 0.1;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10 ;
  }
});
