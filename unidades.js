function unidad(numero, nombre, activo, course, id){
    let template = "<li class='js_sidebar_course_unit_8062 #{active}#'> <a class='item' href='/courses/#{course}#/units/#{id}#' data-navigo> <div class='media media--center'> <div class='circle circle--gray circle--lg'> U#{numero}# </div> <span class='media-body'> #{nombre}# </span> </div> <i class='sidebar-course__content-icon'></i> </a> </li>";
    return template.replace('#{numero}#',numero).replace('#{nombre}#', nombre).replace('#{active}#',activo?'active':'').replace('#{course}#', course).replace('#{id}#', id)
}

function unidades(units, active, course){
    return units.map((element,index) => {
        return unidad(index+1, element.name, element.id==active, course, element.id)
    }).join('');
}