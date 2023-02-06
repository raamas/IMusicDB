let input = document.getElementById('song-name')
let form = document.getElementById('form')
let resultsContainer =document.getElementById("results-container")
let reloadBtn = document.getElementById('reload')
let query
var results;

reloadBtn.setAttribute('class','display-none')

async function getSong(songTitle){
  console.log(`https://musicbrainz.org/ws/2/recording?fmt=json&query=${encodeURIComponent(songTitle)}&limit=10&offset=0`)
  const response = await fetch(`https://musicbrainz.org/ws/2/recording?fmt=json&query=${encodeURIComponent(songTitle)}&limit=240&offset=0`)
  let data = response.json()
  return data
}

async function getCoverArt(releaseID){
  const res = await fetch(`http://coverartarchive.org/release/${releaseID}`)
  let data = res.json()
  return data
}

input.addEventListener("input", (e,)=>{
  query = e.target.value
})

form.addEventListener('submit',(e)=>{
  e.preventDefault()
  getSong(query).then((data)=>{
    results=data.recordings
    console.log(results)

    for (const result of results) {
      console.log(result)
      var node
      let div = document.createElement('div')
      div.setAttribute('class','result-container')

      let img = document.createElement('img')
      img.setAttribute('alt','cover image')
      img.setAttribute('class','sm-cover-image')

      let intlReleaseCode
      if (result.releases){
        for (release of result.releases){
          if (release.country == 'XW'){
            console.log(release)
  
            intlReleaseCode = release.id
          } else if (release.country == 'US'){
            intlReleaseCode = release.id
  
          } else {
            intlReleaseCode = release.id
          }
        }
      }

      let imgURL = getCoverArt(intlReleaseCode).then((data)=>{
        console.log(data['images'][0]['image'])
        img.setAttribute('src',data['images'][0]['image'])
        // imgStatus = data['images'][0]['image']
      }).catch((err)=>{
        console.log(err)
        img.setAttribute('src','static/404.svg')
      })

      let titleNode = document.createTextNode(result.title)
      let titleH3 = document.createElement('h3')
      titleH3.setAttribute('class','result-title')
      titleH3.appendChild(titleNode)

      div.appendChild(img)
      div.appendChild(titleH3)

      for (const artist of result['artist-credit']) {
        let joinphrase = (artist.joinphrase) ? artist.joinphrase : ''
        console.log(artist)
        
        artistNode = document.createTextNode('' + artist.name + joinphrase )
        div.appendChild(artistNode)
      }
      
      let releaseDate = document.createTextNode(`${result['first-release-date']}`)
      let releaseAlbum = (result.releases) ? document.createTextNode(`${result.releases[0]['release-group']['title']}`) : document.createTextNode('Single')
      
      let albumSpan = document.createElement('span')
      albumSpan.setAttribute('class','album-info-container')
      albumSpan.appendChild(releaseAlbum)

      let rDateSpan = document.createElement('span')
      rDateSpan.setAttribute('class','r-date-container')
      rDateSpan.appendChild(releaseDate)

      let infoDiv = document.createElement('div')
      infoDiv.setAttribute('class',' font-italic font-14px result-info-container')

      infoDiv.appendChild(albumSpan)
      infoDiv.appendChild(rDateSpan)
      div.appendChild(infoDiv)
      resultsContainer.appendChild(div)

    }

  })
  reloadBtn.setAttribute('class','display-block btn back-btn')
})

reloadBtn.addEventListener('click',(e)=>{
  // results = ''
  // e.preventDefault()
  location.reload()
})