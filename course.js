function changeUnit(){
  let value = document.getElementById("js-course-course-select-navigation").value;
  if(value&&value!="") router.navigate(value)
}

function courseContent(id, name, content, teacher){
    let template = `<div class='course-page' data-params='{&quot;course_purchased&quot;:true}' id='course-row-1900'>
    <div class='container'>
      <div class='row'>
        <div class='col-md-12'>
          <div class='course-header-new'>
            <div class='course-header-new__title-wrapper'>
              <div class='d-md-none'>
              </div>
              <h1 class='course-header-new__title'>
                <a href='/courses/#{id}#' data-navigo>
                  #{name}#</a>
              </h1>
              <h2 class='course-header-new__course-by d-none d-md-flex'>
                <span>
                  Un curso de <span class='popover--teacher__wrapper js-teacher-popover-wrapper'><a
                      class='js-teacher-popover-link' href='' data-navigo>#{teacher.name}#</a>
                  </span>
                </span>
                , #{teacher.description}#
              </h2>
            </div>
            <br>
          </div>
          <div class='d-md-none'>
            <div class='sidebar-course__section'>
              <div class='teacher-badge media media--center mb-4'>
                <div class='media-body'>
                  Un curso de <span class='popover--teacher__wrapper js-teacher-popover-wrapper'><a
                      class='teacher-badge__name js-teacher-popover-link'
                      href=''>#{teacher.name}#</a>
                  </span>
                  <div class='teacher-badge__role'>
                    #{teacher.description}#
                  </div>
                  <div class='teacher-badge__location'>
                    #{teacher.location}#
                  </div>
                </div>
                <div class='avatar avatar--m'>
                  <a href=''><img width='48' height='48'
                      alt='#{teacher.name}#' title='#{teacher.name}#' class=' lazyload'
                      src='/teacher.webp' />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <nav class='m-mobile-navigation mb-6' role='navigation'>
            <select class='form-control' id='js-course-course-select-navigation' onchange="changeUnit()">
              <option
                value=''>
                Unidades
              </option>
            </select>
          </nav>
        </div>
        <div class='col-md-9' id="course-content">
            #{course-content}#
        </div>
        <div class='col-md-3 d-md-block d-none'>
          <div class='sidebar-course sidebar-course--purchased'>
            <div class='m-stack m-stack--lg'></div>
            <nav role='navigation'>
              <ul class='nav nav--lateral-new nav--course-new'>
                <li class='active'>
                  <a
                    href='' data-navigo>Unidades</a>
                  <ul id="menu-unidades">

                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  return template.replaceAll('#{course-content}#', content).replaceAll('#{name}#',name).replaceAll('#{id}#',id)
  .replaceAll('#{teacher.name}#', teacher.name)
  .replaceAll('#{teacher.description}#', teacher.description)
  .replaceAll('#{teacher.location}#', teacher.location);
}