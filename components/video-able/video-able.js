class VideoAble extends HTMLElement {
    connectedCallback() {
        let id = this.attributes.poster.value.replaceAll('/','_').replaceAll('.','_').replaceAll('-','_');
        this.innerHTML = `<div style="position: relative;">
        <div class="video_able_options" id="options_${id}">
            <div class="video_able_option_button" onClick="playVideo(${id})"><div class="play_icon"></div></div>
            <div class="video_logo"></div>
        </div>
        <video id="${id}" poster="${this.attributes.poster.value}" preload="${this.attributes.preload.value}" src="${this.attributes.src.value}"></video>
        </div>`
    }
}

customElements.define('video-able', VideoAble);

function processVideos(){
    let videos = document.getElementsByTagName('video');
    for(let v=0;v < videos.length; v++){
        videos[v].controls = false;
        videos[v].addEventListener('pause', pauseVideo);
        videos[v].addEventListener('fullscreenchange', pauseVideo);
        videos[v].addEventListener('mozfullscreenchange', pauseVideo);
        videos[v].addEventListener('webkitfullscreenchange', pauseVideo);
    }
}

function playVideo(video){
    video.setAttribute('controls', 'true');
    document.getElementById('options_' + video.id).hidden = true;
    video.play();
}

function pauseVideo(event){
    setTimeout(() => {
        if (event.target.paused && document.fullscreenElement !== event.target) {
            event.target.controls = false;
            document.getElementById('options_' + event.target.id).hidden = false;
        }
    }, 450);
}


loadComponentStyle('/components/video-able/video-able.css?v=0.0.2')
window.addEventListener('processVideos',processVideos)