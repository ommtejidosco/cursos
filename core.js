import * as storage from './storage.js';
let coursesStorage = "https://cursos-omm-tejidos.s3.amazonaws.com";
let checker = {};
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
function getFnByName(functionName, context) {
    functionName.split(".").forEach(ns => context = context[ns]);
    return context;
}
function execFnByName(functionName, context, args) {
    let funcArgs = Array.prototype.slice.call(arguments, 2);
    let func = getFnByName(functionName, context)
    if (func) return func.apply(context, funcArgs);
}
function loadComponent(component, func, context, args, before, after) {
    if (getFnByName(func, context)) {
        clearInterval(checker[func])
        checker[func] = undefined;
        execFnByName(func, context, args)
        after();
    } else if (!checker[func]) {
        before();
        checker[func] = setInterval(loadComponent, 250, component, func, window, args, before, after)
        component.forEach((module) => addScript(module, document.body, true, 'module'))
    }
}
function addScript(src, parent, async, type) {
    let script = document.createElement('script');
    script.async = async;
    script.src = src;
    script.type = type;
    parent.appendChild(script);
}
function loadComponentStyle(style){
    let cest = document.createElement('link');
    cest.href = style;
    cest.rel = 'stylesheet';
    document.head.appendChild(cest);
}
async function updateProfile() {
    if (storage.instance.get('AuthId') && !storage.ins.get('llavero-amanecer')) addScript(coursesStorage + '/DsmFmyogoqiX5lC+E4c1sn8BkDA.js', document.body, true)
    if (storage.instance.get('AuthId') && !storage.ins.get('espejo-renacer')) addScript(coursesStorage + '/RO91eBoI0HjoVMTI/qRd5dFSZmM.js', document.body, true)
}
function emitEvent(eventName, ...args){
    return window.dispatchEvent(new CustomEvent(eventName, {detail: args}))
}

export {loadComponent as loadComponent}
export {loadComponentStyle as loadComponentStyle}
export {emitEvent as emitEvent}
export {updateProfile as updateProfile}
export {addScript as addScript}
export {storage as storage}
export {coursesStorage as coursesStorage}