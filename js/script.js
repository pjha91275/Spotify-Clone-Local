console.log("Lets write Javascript");

let currentSong = new Audio();
let songs;
let currSongFolder;
let currThumbnailFolder;

function formatSecondsToMinutes(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const formattedMins = String(mins).padStart(2, "0");
  const formattedSecs = String(secs).padStart(2, "0");

  return `${formattedMins}:${formattedSecs}`;
}

async function getSongs(folder) {
  currSongFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    let element = as[index];
    if (element.href.endsWith(".mp3.preview")) {
      songs.push(element.href.split(`/${folder}/`)[1].replace(".preview", "").replaceAll("%20", " "));
    }
  }

  // show all the songs in the playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    console.log(`/${currSongFolder}/${song.replaceAll("%20"," ")}`)
    let audio = new Audio(`/${currSongFolder}/${song.replaceAll("%20"," ")}`);
    currThumbnailFolder = currSongFolder.replace("songs", "songsThumbnail");
    audio.addEventListener("loadedmetadata", () => {
      songUL.innerHTML =songUL.innerHTML +`<li><img class ="thumbnail" src = "${currThumbnailFolder}/${song.replaceAll("%20"," ").replace(".mp3", "")}.jpeg" alt = "">
                <div class="info">
                  <div class = "song">${song.replace(".mp3", "")}</div>
                  <div class = "artist">${currSongFolder.replace("songs/","").replaceAll("_"," ")}</div>
                </div>
                <div class="durationPlay">
                  <div class="duration">${formatSecondsToMinutes(
                    Math.floor(audio.duration || 0)
                  )}</div>
                  <img class = "invert play" src = "SVG/play.svg" alt = "">
                </div></li>`;
    });
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
  currentSong.src = `/${currSongFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "SVG/pause.svg";
  }

  document.querySelector(".songThumbnail").innerHTML = `<img src = "${currThumbnailFolder}/${track.replace(".mp3","" )}.jpeg" alt = ""></img>`;
  document.querySelector(".songName").innerHTML = decodeURI(track).replace(".mp3","");
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
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-3)[0].replaceAll("%20"," ");
      //Get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder = "${folder}" class="card">
              <div class="play">
                <div class ="playButton">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="black" >
                <polygon points="8,5 8,19 19,12" />
                </svg>
                </div>
              </div>

              <img src="/songs/${folder}/cover.jpeg" alt = "">
              <h2>${response.title}</h2>
              <p>${response.description}</p>
         </div>`;
    }
  }

  //load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  //Get the list of all songs
  await getSongs("songs/Arijit_Singh");
  playMusic(songs[0], true);

  //Display the albums on the page
  displayAlbums();

  //attac

  //Attach an event listener to play 
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "SVG/pause.svg";
    } else {
      currentSong.pause();
      play.src = "SVG/play.svg";
    }
  });

  // listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    var currentTime = Math.floor(currentSong.currentTime);
    var duration = Math.floor(currentSong.duration || 0);
    document.querySelector(".songTime").innerHTML = `${formatSecondsToMinutes(
      currentTime
    )} / ${formatSecondsToMinutes(duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";

    //Auto start next song when one ends & play the playlist in loop
    if (currentSong.ended) {
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
      if (index + 1 < songs.length) {
        playMusic(songs[index + 1]);
      } else {
        playMusic(songs[0]);
      }
    }
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

//add event listener to previous & repeat even after the playlist comes to start point
previous.addEventListener("click", () => {
  currentSong.pause();
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," "));
  if (index - 1 >= 0) {
    playMusic(songs[index - 1]);
  } else {
    playMusic(songs[(songs.length-1)]);
  }
});

//add event listener to next & repeat even after the playlist ends
next.addEventListener("click", () => {
  currentSong.pause();
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," "));
  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
  } else {
    playMusic(songs[0]);
  }
});

//add an event to volume range bar
document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
    if(currentSong.volume == 0){
        document.querySelector(".volume > img").src = "SVG/mute.svg";
    }
    else if (currentSong.volume > 0 && currentSong.volume <= 0.5 ) {
      document.querySelector(".volume > img").src = "SVG/lowVolume.svg";
    }
    else{
        document.querySelector(".volume > img").src = "SVG/highVolume.svg";
    }
  });

//add 2 event listeners to mute, decrease, or increase the volume by clicking on volume button
document.querySelector(".volume > img").addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.src.includes("SVG/mute.svg")) {
    e.target.src = "SVG/lowVolume.svg";
    currentSong.volume = 0.5;
    document
      .querySelector(".range")
      .getElementsByTagName("input")[0].value = 50;
  } 
  else if(e.target.src.includes("SVG/lowVolume.svg")){
    e.target.src = "SVG/HighVolume.svg";
    currentSong.volume = 1;
    console.log(currentSong.volume);
    document.querySelector(".range").getElementsByTagName("input")[0].value = 100;
  }
  else{
     e.target.src = "SVG/mute.svg";
    currentSong.volume = 0;
    console.log(currentSong.volume);
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
})

  document.querySelector(".volume > img").addEventListener("dblclick", (e) => {
  console.log(e.target);
  if(e.target.src.includes("SVG/mute.svg")){
    e.target.src = "SVG/highVolume.svg";
    currentSong.volume = 1;
    document
      .querySelector(".range")
      .getElementsByTagName("input")[0].value = 100;
  }
  else if(e.target.src.includes("SVG/highVolume.svg")){
    e.target.src = "SVG/mute.svg";
    currentSong.volume = 0;
    console.log(currentSong.volume);
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
     e.target.src = "SVG/lowVolume.svg";
    currentSong.volume = 0.5;
    console.log(currentSong.volume);
    document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
  }
});
