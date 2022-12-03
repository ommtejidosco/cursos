class VideoAble extends HTMLElement {
    connectedCallback() {
        let id = this.attributes.poster.value.replaceAll('/', '_').replaceAll('.', '_').replaceAll('-', '_');
        this.innerHTML = `<div class="video-container" id="video-container_${id}">
        <div class="video_able_options" id="options_${id}">
            <div class="video_able_option_button"><div class="play_icon"></div></div>
            <div class="video_logo"></div>
        </div>
        <video controls class="video" id="${id}" preload="${this.attributes.preload.value}" poster="${this.attributes.poster.value}">
          <source src="${this.attributes.src.value}" type="video/mp4"></source>
        </video>
        <div class="video-controls hide" id="video-controls_${id}">
          <div class="video-progress">
            <progress id="progress-bar_${id}" value="0" min="0"></progress>
            <input class="seek" id="seek_${id}" value="0" min="0" type="range" step="1">
            <div class="seek-tooltip" id="seek-tooltip_${id}">00:00</div>
          </div>
          <div class="bottom-controls">
            <div class="left-controls">
              <button id="play_${id}">
                <svg class="playback-icons">
                  <use href="#play-icon"></use>
                  <use class="hidden" href="#pause"></use>
                </svg>
              </button>
              <div class="volume-controls">
                <button class="volume-button" id="volume-button_${id}">
                  <svg>
                    <use class="hidden" href="#volume-mute"></use>
                    <use class="hidden" href="#volume-low"></use>
                    <use href="#volume-high"></use>
                  </svg>
                </button>
                <input class="volume" id="volume_${id}" value="1"
                data-mute="0.5" type="range" max="1" min="0" step="0.01">
              </div>
              <div class="time">
                <time id="time-elapsed_${id}"></time>
                <time id="duration_${id}"></time>
              </div>
            </div>
            <div class="right-controls">
              <button class="fullscreen-button" id="fullscreen-button_${id}">
                <svg>
                  <use href="#fullscreen"></use>
                  <use href="#fullscreen-exit" class="hidden"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
        </div>`;
        this.video = document.getElementById(id);
        this.videoOptions = document.getElementById(`options_${id}`);
        this.videoControls = document.getElementById(`video-controls_${id}`);
        this.playButton = document.getElementById(`play_${id}`);
        this.timeElapsed = document.getElementById(`time-elapsed_${id}`);
        this.duration = document.getElementById(`duration_${id}`);
        this.progressBar = document.getElementById(`progress-bar_${id}`);
        this.seek = document.getElementById(`seek_${id}`);
        this.seekTooltip = document.getElementById(`seek-tooltip_${id}`);
        this.volumeButton = document.getElementById(`volume-button_${id}`);
        this.volume = document.getElementById(`volume_${id}`);
        this.fullscreenButton = document.getElementById(`fullscreen-button_${id}`);
        this.videoContainer = document.getElementById(`video-container_${id}`);
        this.playbackIcons = this.videoContainer.querySelectorAll(`.playback-icons use`);
        this.volumeIcons = this.volumeButton.querySelectorAll('use');
        this.volumeMute = this.volumeButton.querySelector('use[href="#volume-mute"]');
        this.volumeLow = this.volumeButton.querySelector('use[href="#volume-low"]');
        this.volumeHigh = this.volumeButton.querySelector('use[href="#volume-high"]');
        this.fullscreenIcons = this.fullscreenButton.querySelectorAll('use');

        const videoWorks = !!document.createElement('video').canPlayType;
        if (videoWorks) {
            this.video.controls = false;
        }
        // Add eventlisteners here
        this.video.addEventListener('click', this.togglePlay);
        this.videoOptions.addEventListener('click', this.togglePlay);
        this.playButton.addEventListener('click', this.togglePlay);
        this.video.addEventListener('play', this.updatePlayButton);
        this.video.addEventListener('pause', this.updatePlayButton);
        this.video.addEventListener('loadedmetadata', this.initializeVideo);
        this.video.addEventListener('timeupdate', this.updateTimeElapsed);
        this.video.addEventListener('timeupdate', this.updateProgress);
        this.video.addEventListener('volumechange', this.updateVolumeIcon);
        this.video.addEventListener('mouseenter', this.showControls);
        this.video.addEventListener('mouseleave', this.hideControls);
        this.videoOptions.addEventListener('mouseleave', this.hideControls);
        this.videoControls.addEventListener('mouseenter', this.showControls);
        this.videoControls.addEventListener('mouseleave', this.hideControls);
        this.seek.addEventListener('mousemove', this.updateSeekTooltip);
        this.seek.addEventListener('input', this.skipAhead);
        this.volume.addEventListener('input', this.updateVolume);
        this.volumeButton.addEventListener('click', this.toggleMute);
        this.fullscreenButton.addEventListener('click', this.toggleFullScreen);
        this.videoContainer.addEventListener('fullscreenchange', this.updateFullscreenButton);
    }
    togglePlay = () => {
        if (this.video.paused || this.video.ended) {
            this.video.play();
            this.videoOptions.hidden = true;
            this.showControls()
        } else {
            this.video.pause();
            this.videoOptions.hidden = false;
            this.hideControls();
        }
    }
    updatePlayButton = () => {
        this.playbackIcons.forEach((icon) => icon.classList.toggle('hidden'));
    }
    formatTime = (timeInSeconds) => {
        const result = new Date(timeInSeconds * 1000).toISOString().substring(11, 19);
        return {
            minutes: result.substring(3, 5),
            seconds: result.substring(6, 8),
        };
    }
    initializeVideo = () => {
        const videoDuration = Math.round(this.video.duration);
        this.seek.setAttribute('max', videoDuration);
        this.progressBar.setAttribute('max', videoDuration);
        const time = this.formatTime(videoDuration);
        this.updateTimeElapsed()
        this.duration.innerText = `${time.minutes}:${time.seconds}`;
        this.duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
    }
    updateTimeElapsed = () => {
        const time = this.formatTime(Math.round(this.video.currentTime));
        this.timeElapsed.innerText = `${time.minutes}:${time.seconds} /`;
        this.timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
    }
    updateProgress = () => {
        this.seek.value = Math.floor(this.video.currentTime);
        this.progressBar.value = Math.floor(this.video.currentTime);
    }
    updateSeekTooltip = (event) => {
        const skipTo = Math.round(
            (event.offsetX / event.target.clientWidth) *
            parseInt(event.target.getAttribute('max'), 10)
        );
        this.seek.setAttribute('data-seek', skipTo);
        const t = this.formatTime(skipTo);
        this.seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
        const rect = this.video.getBoundingClientRect();
        this.seekTooltip.style.left = `${event.pageX - rect.left}px`;
    }
    skipAhead = (event) => {
        const skipTo = event.target.dataset.seek
            ? event.target.dataset.seek
            : event.target.value;
        this.video.currentTime = skipTo;
        this.progressBar.value = skipTo;
        this.seek.value = skipTo;
    }
    updateVolume = () => {
        if (this.video.muted) {
            this.video.muted = false;
        }
        this.video.volume = this.volume.value;
    }
    updateVolumeIcon = () => {
        this.volumeIcons.forEach((icon) => {
            icon.classList.add('hidden');
        });
        if (this.video.muted || this.video.volume === 0) {
            this.volumeMute.classList.remove('hidden');
        } else if (this.video.volume > 0 && this.video.volume <= 0.5) {
            this.volumeLow.classList.remove('hidden');
        } else {
            this.volumeHigh.classList.remove('hidden');
        }
    }
    toggleMute = () => {
        this.video.muted = !this.video.muted;
        if (this.video.muted) {
            this.volume.setAttribute('data-volume', this.volume.value);
            this.volume.value = 0;
        } else {
            this.volume.value = this.volume.dataset.volume;
        }
    }
    
    toggleFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (document.webkitFullscreenElement) {
            // Need this to support Safari
            document.webkitExitFullscreen();
        } else if (this.videoContainer.webkitRequestFullscreen) {
            // Need this to support Safari
            this.videoContainer.webkitRequestFullscreen();
        } else {
            this.videoContainer.requestFullscreen();
        }
    }
    updateFullscreenButton = () => {
        this.fullscreenIcons.forEach((icon) => icon.classList.toggle('hidden'));
    }
    hideControls = () => {
        this.videoControls.classList.add('hide');
    }
    showControls = () => {
        this.videoControls.classList.remove('hide');
    }
}
customElements.define('video-able', VideoAble);
loadComponentStyle('/components/video-able/video-able.css?v=1.0.0')