const router = new Navigo("/");
var mqtt;
var reconnecTimeout = 2000;
var host = "test.mosquitto.org";
var port = 8081;
var LOADED_TOPIC = "ommtejidos/loaded/";
let checker = {};
let loader = {
    'coursesRoute': ['/courses.js'],
    'openCourse': ['/course.js']
}
let userName = '';

router.hooks({
    after() {
        router.updatePageLinks();
        hideMenu()
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    already(){
        hideMenu()
    }
});

function breadCon(courseId, courseName, unitName) {
    let breadcrumb = document.getElementsByClassName('breadcrumb')[0];
    let courseBread = document.getElementById('course-bread')
    let unitBread = document.getElementById('unit-bread')
    if (courseBread) breadcrumb.removeChild(courseBread)
    if (unitBread) breadcrumb.removeChild(unitBread)
    if (courseId && courseName && unitName) {
        let courseLi = document.createElement('li');
        courseLi.id = 'course-bread';
        courseLi.innerHTML = `<a href='/courses/` + courseId + `' data-navigo>` + courseName + `</a>`;
        let unitLi = document.createElement('li');
        unitLi.id = 'unit-bread';
        unitLi.innerHTML = unitName;
        breadcrumb.append(courseLi, unitLi);
    }
}
router.on("/", function(match){
        routeChecker('coursesRoute', match)
    })
    .on("/index.html", function(match){
        routeChecker('coursesRoute', match)
    })
    .on("/courses", redirect)
    .on("/courses/:id", function(match){
        routeChecker('openCourse', match)
        showGreeting(userName.split(' ')[0])
    })
    .on("/courses/:id/units/:unit", function(match){
        routeChecker('openCourse', match)
        showGreeting(userName.split(' ')[0])
    });

function redirect(match){
    router.navigate('/');
}

function routeChecker(func, match){
    if(getFunctionByName(func, window)){
        hideLoadingBar()
        clearInterval(checker[func])
        checker[func] = undefined;
        executeFunctionByName(func, window, match)
        router.updatePageLinks();
    }else if(!checker[func]){
        showLoadingBar()
        checker[func] = setInterval(routeChecker, 250, func, match)
        loader[func].forEach((module) => addScript(module, document.body, true))
    }
}

function sendMessage(topic, msg) {
    //console.log('Send to '+topic, msg)
    let message = new Paho.MQTT.Message(JSON.stringify(msg));
    message.retained = true;
    message.destinationName = topic;
    mqtt.send(message);
}

function onConnect() {
    console.log("Connected");
    let account = localStorage.getItem('account')
    window.verifyResponse(account)
            .then(r => {
                sendMessage(LOADED_TOPIC+localStorage.getItem('AuthId'),{
                    "name": r.payload.name,
                    "time": new Date()
                })
                mqtt.disconnect()
            })
};

function createClient() {
    mqtt = new Paho.MQTT.Client(host, port, "clientjs");
    var options = {
        onSuccess: onConnect,
        useSSL: true,
        cleanSession: true
    };
    mqtt.connect(options);
};

function addScript(src, parent, async) {
    let script = document.createElement('script');
    script.async = async;
    script.src = src;
    parent.appendChild(script);
}

function showInitialGreeting(){
    let account = localStorage.getItem('account')
    window.verifyResponse(account).then(r => {
        userName = r.payload.name;
        showGreeting('Hola, '+userName.split(' ')[0]+'!');
    }).catch(err => console.log(err))
}

function showGreeting(greeting){
    document.getElementById('greeting').innerHTML = greeting;
}

window.addEventListener('load', (event) => {
    router.resolve();
    showInitialGreeting();
    addScript('/contact/contact.js', document.body, true);
});