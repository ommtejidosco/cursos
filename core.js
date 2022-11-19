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
        component.forEach((module) => addScript(module, document.body, true))
    }
}
function addScript(src, parent, async) {
    let script = document.createElement('script');
    script.async = async;
    script.src = src;
    parent.appendChild(script);
}