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
        videos[v].addEventListener('pause', (event) => {
            setTimeout(() => {
                if (videos[v].paused) {
                    videos[v].removeAttribute('controls');
                    document.getElementById('options_' + videos[v].id).hidden = false;
                }
            }, 450);
        });
        videos[v].onplay = (event)=>{
            videos[v].setAttribute('controls', 'true');
            document.getElementById('options_' + videos[v].id).hidden = true;
        }
    }
}

function playVideo(video){
    video.play();
}

loadComponentStyle('/components/video-able/video-able.css')

window.addEventListener('processVideos',processVideos)