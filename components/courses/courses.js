function createItem(course, opened) {
  let template = `<li class="paper paper--shadowless course-item">
    <div class="paper__body">
      <div class="row">
        <div class="col-sm-5 col-md-4">
          <a class="course-item__image"
            title="#{name}#. #{description}#"
            href="/courses/#{id}#" data-navigo>
            <picture>
                <img
                width="640"
                height="360"
                alt="#{name}#. #{description}#"
                class=" a-placeholder a-placeholder--standalone"
                src="#{image}#">
            </picture>
          </a>
        </div>
        <div class="col-sm-7 col-md-8">
          <div class="course-item__body">
            <div class="course-item__body__header">
              <h3 class="h2 course-item__title">
                <a
                  href="/courses/#{id}#" data-navigo>#{name}#</a>
              </h3>
              <p class="course-item__teacher">
                #{description}#
              </p>
            </div>
            <div class="btn-toolbar">
              <a class="a-button a-button--primary a-button--small mt-4 mr-4"
                href="/courses/#{id}#" data-navigo><span>#{open-course}#</span>
                <i class="a-icon-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>`;
  return template.replaceAll('#{id}#', course.id).replaceAll('#{name}#', course.name).replaceAll('#{image}#', course.image).replaceAll('#{description}#', course.description)
  .replaceAll('#{open-course}#',opened?'Continuar':'Iniciar');
}

function courseList(courses) {
  let template = `<div class="js-courses-wrapper">
  <div class="container anchor" id="my-courses">
    <div class="region">
      <header class="region__header">
        <h2 class="h1 region__title">Mis cursos</h2>
      </header>
      <div class="js-infinite-scroll-pages">
        <ul class="courses-list-wide courses-list-wide--with-project js-infinite-scroll-page">
          #{courses}#
        </ul>
      </div>
    </div>
  </div>
</div>`;
  let pending = {
    "id": "llavero-amanecer",
    "version": "1.0",
    "name": "Llavero Amanecer",
    "description": "Un curso de Laura Duque Gonz??lez",
    "image": "/courses/llavero-amanecer-2.webp"
  }
  let mirror = {
    "id": "espejo-renacer",
    "version": "1.0",
    "name": "Espejo Renacer",
    "description": "Un curso de Laura Duque Gonz??lez",
    "image": "/courses/espejo-renacer.webp"
  }
  if(courses.filter(course => course.id == pending.id).length == 0) courses.splice(1,0,pending)
  if(courses.filter(course => course.id == mirror.id).length == 0) courses.splice(2,0,mirror)
  let courseItems = courses.map((element) => {
    return createItem(element, localStorage.getItem(element.id+'-opened')?true:false)
  });
  document.getElementById('content').innerHTML = template.replaceAll('#{courses}#', courseItems.join(''))
}

function coursesRoute(match) {
  let account = localStorage.getItem('account')
  window.verifyResponse(account)
      .then(r => {
          emitEvent('breadCon')
          courseList(r.payload.courses)
          emitEvent('updatePageLinks')
      }).catch(err => console.log(err))
}

window.coursesRoute = coursesRoute