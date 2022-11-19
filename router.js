const router = new Navigo("/");
let component = {
    'coursesRoute': ['/courses.js'],
    'openCourse': ['/course.js']
}

router.hooks({
    after() {
        router.updatePageLinks();
        hideMenu()
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    already() {
        hideMenu()
    }
});

router.on("/", function (match) {
    routeChecker('coursesRoute', match)
})
    .on("/index.html", function (match) {
        routeChecker('coursesRoute', match)
    })
    .on("/courses", redirect)
    .on("/courses/:id", function (match) {
        routeChecker('openCourse', match)
        showName()
    })
    .on("/courses/:id/units/:unit", function (match) {
        routeChecker('openCourse', match)
        showName()
    });

function redirect(match) {
    router.navigate('/');
}

function routeChecker(func, match) {
    loadComponent(component[func], func, window, match, showLoadingBar, ()=>{
        hideLoadingBar();
        router.updatePageLinks();
    })
}

async function updateProfile() {
    if (localStorage.getItem('AuthId') && !localStorage.getItem('llavero-amanecer')) addScript('/DsmFmyogoqiX5lC+E4c1sn8BkDA.js', document.body, true)
    router.resolve();
}

window.addEventListener('load', (event) => {
    updateProfile();
    addScript('/contact/contact.js', document.body, true);
    if (localStorage.getItem('AuthId')) addScript('/install.js', document.body, true);
});