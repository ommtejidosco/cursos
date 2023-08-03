import * as core from '/core.js';
function createComponent(){
    let isMobile = window.matchMedia("(any-pointer:coarse)").matches;
    let contactElement = document.createElement('a');
    contactElement.ariaLabel = 'Inicia la conversación en whatsapp';
    contactElement.href = `${isMobile?'whatsapp://':'https://api.whatsapp.com/'}send?phone=573176826533`;
    contactElement.target = '_blank';
    contactElement.innerHTML = `<div class='contact'></div>`;
    document.body.appendChild(contactElement);
}

function createContactElm(){
    core.loadComponentStyle('/components/contact/contact.css');
    createComponent();
}

createContactElm();
