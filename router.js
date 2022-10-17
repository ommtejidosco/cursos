const router = new Navigo("/");

router.hooks({
    after() {
        router.updatePageLinks()
    }
});

function breadCon(courseId, courseName, unitName){
    let breadcrumb = document.getElementsByClassName('breadcrumb')[0];
    let courseBread = document.getElementById('course-bread')
    let unitBread = document.getElementById('unit-bread')
    if(courseBread) breadcrumb.removeChild(courseBread)
    if(unitBread) breadcrumb.removeChild(unitBread)
    if(courseId && courseName && unitName){
        let courseLi = document.createElement('li');
        courseLi.id = 'course-bread';
        courseLi.innerHTML = `<a href='/courses/`+courseId+`' data-navigo>`+courseName+`</a>`;
        let unitLi = document.createElement('li');
        unitLi.id = 'unit-bread';
        unitLi.innerHTML = unitName;
        breadcrumb.appendChild(courseLi);
        breadcrumb.appendChild(unitLi);
    }
}
router.on("/", function (match) {
    router.navigate('/courses')
})
.on("/courses", function (match) {
    let account = localStorage.getItem('account')
    //window.verifyResponse(account)
    //    .then(r => {
            //courseList(r.payload.courses)
            courseList(JSON.parse(account).courses)
            
            breadCon()
            router.updatePageLinks()
    //    })
}).on("/courses/:id", function (match) {
    let course = JSON.parse(localStorage.getItem(match.data.id))
    let content = courseContent(course.id, course.name, course.units[0].content, course.teacher);
    document.getElementById('content').innerHTML = content;
    let unit = course.units[0].id;
    breadCon(course.id,course.name, course.units[0].name);
    document.getElementById('menu-unidades').innerHTML = unidades(course.units, unit, match.data.id)
    let mobileUnits = document.getElementById('js-course-course-select-navigation')
    unidadesMobile(course.id, course.units, unit).forEach(element => {
        mobileUnits.appendChild(element);
    });
}).on("/courses/:id/units/:unit", function (match) {
    let course = JSON.parse(localStorage.getItem(match.data.id))
    let unit = match.data.unit;
    let selectedUnit;
    course.units.forEach((value, index) => {
        if (value.id == match.data.unit) selectedUnit = index;
    })
    breadCon(course.id,course.name, course.units[selectedUnit].name);
    let content = courseContent(course.id, course.name, course.units[selectedUnit].content, course.teacher);
    document.getElementById('content').innerHTML = content;
    document.getElementById('menu-unidades').innerHTML = unidades(course.units, unit, match.data.id)
    let mobileUnits = document.getElementById('js-course-course-select-navigation')
    unidadesMobile(course.id, course.units, unit).forEach(element => {
        mobileUnits.appendChild(element);
    });
});

window.addEventListener('load', (event) => {
    router.resolve()
});
