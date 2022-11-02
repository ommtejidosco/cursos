const router = new Navigo("/");
var mqtt;
var reconnecTimeout = 2000;
var host = "test.mosquitto.org";
var port = 8081;
var LOADED_TOPIC = "ommtejidos/loaded/";
let checker;

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
        breadcrumb.appendChild(courseLi);
        breadcrumb.appendChild(unitLi);
    }
}
router.on("/", coursesRoute)
    .on("/index.html", coursesRoute)
    .on("/courses", redirect)
    .on("/courses/:id", routeChecker)
    .on("/courses/:id/units/:unit", routeChecker);

function redirect(match){
    router.navigate('/');
}

function routeChecker(match){
    if(window.openCourse) window.openCourse(match)
    else checker = setInterval(check, 300, match)
}
function check(match){
    if(window.openCourse){
        window.openCourse(match)
        clearInterval(checker)
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

function addScript(src, parent) {
    let script = document.createElement('script');
    script.src = src;
    parent.appendChild(script);
}

window.addEventListener('load', (event) => {
    //createClient();
    addScript('/contact/contact.js', document.body);
    addScript('/course.js', document.body);
    addScript('/unidades.js', document.body);
    addScript('/unidades-mobile.js', document.body);
    router.resolve();
});
