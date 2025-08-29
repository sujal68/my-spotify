let currentSong = new Audio();
let play = document.getElementById("play");
let currentTrack = null;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response;

    let links = div.getElementsByTagName("a")

    let songHrefs = [];
    for (let i = 0; i < links.length; i++) {
        let href = links[i].getAttribute("href")
        if (href.endsWith(".mp3")) {
            songHrefs.push(href.split("/songs/")[1])
        }
    }

    return songHrefs
}

const playMusic = (track) => {
    currentSong.src = "/songs/" + track
    currentSong.play()
    currentTrack = track;

    play.classList.remove("ri-play-large-fill");
    play.classList.add("ri-pause-mini-fill");

    let musicName = document.querySelector(".playing-song .music-content h5");
    let artistName = document.querySelector(".playing-song .music-content h6");
    document.querySelector(".current-time");
    document.querySelector(".total-time");

    if (musicName) musicName.innerText = track.replaceAll("%20", " ");  // song name
    if (artistName) artistName.innerText = "Sujal Kidecha";
}

async function main() {

    // get the list of all song 
    let songs = await getsongs()
    console.log(songs);

    // show all the song in the playlist
    let songul = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li class="flex align-item-center justify-content-between">
             <div class="start flex align-item-center">
                <i class="ri-music-2-line"></i>
                <div class="info">
                    <div class="song-name">${song.replaceAll("%20", " ")}</div>
                    <div class="song-artist"><p>Sujal Kidecha</p></div>
                </div>
             </div>
             <i class="ri-play-fill fs-2_5"></i>
            </li>`;
    }
    // attach an event listener to each song 
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    play.addEventListener("click", () => {
        togglePlayPause(songs);
    });
    // Listen for timeupdate  event
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".current-time").innerHTML =
            secondsToMinutesSeconds(Math.floor(currentSong.currentTime));

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".total-time").innerHTML =
                secondsToMinutesSeconds(Math.floor(currentSong.duration));
        }
    })

    // add an event listener  to seekbar 
    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    // 2️⃣ Spacebar control
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            event.preventDefault(); // page scroll block
            togglePlayPause(songs);
        }
    });

    function togglePlayPause(songs) {
        if (!currentTrack) {
            if (songs.length > 0) {
                playMusic(songs[0]);
            }
        } else {
            if (currentSong.paused) {
                currentSong.play();
                play.classList.remove("ri-play-large-fill");
                play.classList.add("ri-pause-mini-fill");
            } else {
                currentSong.pause();
                play.classList.remove("ri-pause-mini-fill");
                play.classList.add("ri-play-large-fill");
            }
        }
    }

    // Volume control
    let volumeSeekbar = document.getElementById("volume");

    volumeSeekbar.addEventListener("input", function () {
        currentSong.volume = this.value; // 0 to 1 ke beech
    });

    // add an event listener for hamburger 
    document.querySelector(".hame-burger").addEventListener("click", () => {
        document.querySelector(".library").style.left = "0"
    })
    document.querySelector(".close-icon").addEventListener("click", () => {
        document.querySelector(".library").style.left = "-100%"
    })

}
main()   