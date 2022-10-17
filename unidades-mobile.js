function unidadMobile(numero, courseId, id, nombre, activo){
    let option = document.createElement('option');
    option.value = '/courses/'+courseId+'/units/'+id;
    option.selected = activo;
    option.innerHTML = "&nbsp; "+numero + " " + nombre +"&nbsp;&nbsp;";
    return option;
}

function unidadesMobile(courseId, units, active){
    return units.map((element,index) => {
        return unidadMobile(index+1, courseId, element.id, element.name, element.id==active)
    });
}