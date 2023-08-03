import * as core from '/core.js';

let userFullname, userName, lastName;
async function showInitialGreeting() {
    let account = core.storage.instance.get('account')
    window.verifyResponse(account).then(r => {
        if (r.payload.name) {
            userFullname = r.payload.name;
            let names = userFullname.split(' ')
            userName = names[0]
            lastName = names.length > 2 ? names[2] : names[1];
        }
        let greeting = getRandomInt(0, 2) == 0 ? 'Hola' : dayTime()
        showGreeting('¡' + greeting + (userName ? ', ' + userName : '') + '!');
    }).catch(err => console.log(err))
}

async function showGreeting(greeting) {
    document.getElementById('greeting').innerHTML = greeting;
}

async function showName(){
    showGreeting(userName ? userName + ' ' + lastName : 'Cursos')
}

function dayTime() {
    let now = new Date()
    let time = (now.getHours() * 60) + now.getMinutes();
    return time <= 720 ? 'Buenos días' : time <= 1080 ? 'Buenas tardes' : 'Buenas noches';
}

window.addEventListener('load', showInitialGreeting)
window.addEventListener('showName', showName)