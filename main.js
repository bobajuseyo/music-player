let player;

// โหลด YouTube IFrame API
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: "98zHKN-xSHk", // 🎵 ใส่ YouTube Video ID ที่ต้องการเล่น
        playerVars: { autoplay: 0, controls: 0 },
        events: { onReady: onPlayerReady },
    });
}

function onPlayerReady(event) {
    console.log("YouTube Player Ready!");
    
    setupPlayPause(); // ✅ เรียกฟังก์ชันควบคุมปุ่ม Play/Pause
    setupProgressControl(); // ✅ อัปเดต Progress Bar
    setupVolumeControl(); // ✅ เรียกฟังก์ชันควบคุมระดับเสียง
}

function setupPlayPause() {
    const playPauseBtn = document.querySelector(".play-pause");

    function togglePlayPause() {
        if (!player || typeof player.getPlayerState !== "function") return;

        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            playPauseBtn.classList.replace("fa-pause", "fa-play");
        } else {
            player.playVideo();
            playPauseBtn.classList.replace("fa-play", "fa-pause");
        }
    }

    playPauseBtn.addEventListener("click", togglePlayPause);
}

function setupProgressControl() {
    const progressBar = document.querySelector(".progress");
    const progressContainer = document.querySelector(".progress-bar");
    const currentTimeEl = document.querySelector(".current-time");
    const durationEl = document.querySelector(".duration");

    function updateProgress() {
        if (!player || typeof player.getCurrentTime !== "function") return;
        
        const progressPercent = (player.getCurrentTime() / player.getDuration()) * 100;
        progressBar.style.width = `${progressPercent}%`;

        currentTimeEl.textContent = formatTime(player.getCurrentTime());
        durationEl.textContent = formatTime(player.getDuration());

        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            requestAnimationFrame(updateProgress);
        }
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    progressContainer.addEventListener("click", function (e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = player.getDuration();
        player.seekTo((clickX / width) * duration, true);
    });

    player.addEventListener("onStateChange", function (event) {
        if (event.data === YT.PlayerState.PLAYING) updateProgress();
    });
}

function setupVolumeControl() {
    const volumeControl = document.querySelector(".volume-control");

    volumeControl.addEventListener("input", function () {
        const volume = volumeControl.value / 100;
        if (player) {
            player.setVolume(volume * 100);  // YouTube API expects volume in percentage (0-100)
        }
    });
}
