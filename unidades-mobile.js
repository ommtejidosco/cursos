function unidadMobile(numero, nombre, activo){
    let option = document.createElement('option');
    option.value = "";
    option.selected = activo;
    option.innerHTML = "&nbsp; "+numero + " " + nombre +"&nbsp;&nbsp;" + (activo ? '✔':'');
    return option;
}

function unidadesMobile(units, active){
    return units.map((element,index) => {
        return unidadMobile(index+1, element.name, element.id==active)
    });
}