function hideMenu(){
    let slideOut = document.getElementsByClassName('mm-wrapper__blocker mm-slideout')[0]
    if (slideOut) slideOut.dispatchEvent(new Event('mousedown'));
}

function toggleMenu(){
    if(document.getElementById('mm-0').style.minHeight) hideMenu();
}