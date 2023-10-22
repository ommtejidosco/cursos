import { storage, addScript, emitEvent, coursesStorage } from '/core.js';

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
    .replaceAll('#{open-course}#', opened ? 'Continuar' : 'Iniciar');
}

function courseList(courses, auth) {
  let template = `<div class="js-courses-wrapper">
  <div class="container anchor" id="my-courses">
    <div class="region">
      <header class="region__header">
        <h2 class="h1 region__title">${auth ? 'Mis cursos' : 'Cursos libres y abiertos'}</h2>
      </header>
      <div class="js-infinite-scroll-pages">
        <ul class="courses-list-wide courses-list-wide--with-project js-infinite-scroll-page">
          #{courses}#
        </ul>
      </div>
    </div>
  </div>
</div>`;
  let basic = {
    "id": "introduccion-macrame",
    "version": "1.0",
    "name": "Introducción al macramé",
    "description": "Un curso de Laura Duque González",
    "image": "/resources/nudo-alondra.webp",
    "content": "QTR1LxnDVLA7QRrRrXcLBSnOtYU"
  }
  let pending = {
    "id": "llavero-amanecer",
    "version": "1.0",
    "name": "Llavero Amanecer",
    "description": "Un curso de Laura Duque González",
    "image": "/courses/llavero-amanecer-2.webp"
  }
  let mirror = {
    "id": "espejo-renacer",
    "version": "1.0",
    "name": "Espejo Renacer",
    "description": "Un curso de Laura Duque González",
    "image": "/courses/espejo-renacer.webp"
  }
  let rdc = {
    "id": "llavero-republica",
    "version": "1.0",
    "name": "Llavero República",
    "description": "Un curso de Laura Duque González",
    "image": "/courses/llavero-republica.png",
    "content": "bGxhdmVybyByZXB1YmxpY2E"
  }
  if (auth && courses.filter(course => course.id == basic.id).length == 0) courses.splice(0, 0, basic)
  if (auth && courses.filter(course => course.id == pending.id).length == 0) courses.splice(1, 0, pending)
  if (auth && courses.filter(course => course.id == mirror.id).length == 0) courses.splice(2, 0, mirror)
  if (auth && courses.filter(course => course.id == rdc.id).length == 0) courses.splice(3, 0, rdc)
  if (!storage.instance.get('introduccion-macrame')) addScript(coursesStorage + '/QTR1LxnDVLA7QRrRrXcLBSnOtYU.js', document.body, true)
  if (!storage.instance.get('llavero-amanecer')) addScript(coursesStorage + '/DsmFmyogoqiX5lC+E4c1sn8BkDA.js', document.body, true)
  if (!storage.instance.get('llavero-republica')) addScript(coursesStorage + '/bGxhdmVybyByZXB1YmxpY2E.js', document.body, true)
  let courseItems = courses.map((element) => {
    return createItem(element, storage.instance.get(element.id + '-opened') ? true : false)
  });
  document.getElementById('content').innerHTML = template.replaceAll('#{courses}#', courseItems.join(''))
}

function coursesRoute(match) {
  let account = storage.instance.get('account')
  window.verifyResponse(account)
    .then(r => {
      emitEvent('breadCon')
      courseList(r.payload.courses, true)
      emitEvent('updatePageLinks')
    }).catch(err => {
      console.log(err)
      emitEvent('breadCon')
      courseList([{
        "id": "introduccion-macrame",
        "version": "1.0",
        "name": "Introducción al macramé",
        "description": "Un curso de Laura Duque González",
        "image": "/resources/nudo-alondra.webp",
        "content": "QTR1LxnDVLA7QRrRrXcLBSnOtYU"
      },
      {
        "id": "llavero-republica",
        "version": "1.0",
        "name": "Llavero República",
        "description": "Un curso de Laura Duque González",
        "image": "/courses/llavero-republica.png",
        "content": "bGxhdmVybyByZXB1YmxpY2E"
      },
      {
        "id": "llavero-amanecer",
        "version": "1.0",
        "name": "Llavero Amanecer",
        "description": "Un curso de Laura Duque González",
        "image": "/courses/llavero-amanecer-2.webp",
        "content": "DsmFmyogoqiX5lC+E4c1sn8BkDA"
      }
      ], false)
      emitEvent('updatePageLinks')
    })
}

window.coursesRoute = coursesRoute