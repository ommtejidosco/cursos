async function getVersion(){
    let lastEvent = await fetch('https://api.github.com/repos/ommtejidosco/cursos/events?per_page=1')
    let version = await lastEvent.json()
    document.getElementById('version').innerHTML = `Versión ${version[0].payload.head.substring(0,7)}`
    console.log(version[0].payload.head.substring(0,7),`https://github.com/ommtejidosco/cursos/commit/${version[0].payload.head}`)
}
getVersion()