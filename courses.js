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
                loading="lazy" class=" a-placeholder a-placeholder--standalone"
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
  let coursesStr = courses.map((element) => {
    return createItem(element, localStorage.getItem(element.id+'-opened')?true:false)
  }).join('');
  document.getElementById('content').innerHTML = template.replaceAll('#{courses}#', coursesStr)
}

function coursesRoute(match) {
  let account = localStorage.getItem('account')
  window.verifyResponse(account)
      .then(r => {
          courseList(r.payload.courses)
          breadCon()
          router.updatePageLinks()
      })
}