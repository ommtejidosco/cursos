function loadComponentStyle(){
    let cest = document.createElement('link');
    cest.href = '/contact/contact.css';
    cest.rel = 'stylesheet';
    document.head.appendChild(cest);
}

function createComponent(){
    let isMobile = window.matchMedia("(any-pointer:coarse)").matches;
    let contactElement = document.createElement('a');
    contactElement.href = (isMobile?'whatsapp://':'https://api.whatsapp.com') + 'send?phone=573176826533';
    contactElement.innerHTML = `<div class='contact'></div>`;
    document.body.appendChild(contactElement);
}

function createContactElm(){
    loadComponentStyle();
    createComponent();
}

createContactElm();
