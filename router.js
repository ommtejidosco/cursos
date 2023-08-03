import * as core from './core.js';
const router = new Navigo("/");
let component = {
    'coursesRoute': ['/components/courses/courses.js?v=1.1.4'],
    'openCourse': ['/components/course/course.js?v=1.3.0','/components/video-able/video-able.js?v=1.2.0']
}

router.hooks({
    after() {
        core.emitEvent('hideMenu')
        router.updatePageLinks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    already() {
        core.emitEvent('hideMenu')
    }
});

router.on("/", coursesRouter)
    .on("/index.html", coursesRouter)
    .on("/courses", redirect)
    .on("/courses/:id",courseRouter)
    .on("/courses/:id/units/:unit", courseRouter);

function redirect(match) {
    router.navigate('/');
}

function coursesRouter(match) {
    routeLoader('coursesRoute', match)
}

function courseRouter(match) {
    routeLoader('openCourse', match)
    core.emitEvent('showName')
}

function routeLoader(route, match) {
    core.loadComponent(component[route], route, window, match,
        ()=> core.emitEvent('showLoadingBar'),
        () => {
            core.emitEvent('hideLoadingBar')
            router.updatePageLinks();
        })
}

function navigate(e) {
    router.navigate(e.detail[0])
}

function updatePageLinks(e) {
    router.updatePageLinks()
}

window.addEventListener('load', (event) => {
    router.resolve();
});

window.addEventListener('routerNavigate', navigate)
window.addEventListener('updatePageLinks', updatePageLinks)