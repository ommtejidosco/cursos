function addManifest(){
    let link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
}

addManifest()
addScript('/install.js', document.body,true);