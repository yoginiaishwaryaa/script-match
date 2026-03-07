const API = window.location.origin

function fileName(url){
 return url.split("/").pop().replace(".mp4","")
}

/* -------------------------
Load homepage
--------------------------*/

async function loadHome(){

 loadAllVideos()
 loadRecommendations()

}

/* -------------------------
ALL VIDEOS (always full list)
--------------------------*/

async function loadAllVideos(){

 const container = document.getElementById("allVideos")

 try{

  const res = await fetch(`${API}/videos`)
  const videos = await res.json()

  container.innerHTML = ""

  videos.forEach(v => {

   const div = document.createElement("div")

   div.className = "video-card"

   div.onclick = () => {
    window.location =
    `watch.html?video=${encodeURIComponent(v.videoUrl)}`
   }

   div.innerHTML = `
     <video class="preview" muted preload="metadata">
        <source src="${v.videoUrl}" type="video/mp4">
     </video>
     <p class="video-title">${fileName(v.videoUrl)}</p>
   `

   container.appendChild(div)

  })

 }catch(err){

  console.error(err)
  container.innerHTML = "Failed to load videos"

 }

}

/* -------------------------
RECOMMENDATIONS
--------------------------*/

async function loadRecommendations(){

 const container = document.getElementById("recommendations")

 const stored = localStorage.getItem("lastKeywords")

 if(!stored){

  container.innerHTML = "<p>No recommendations yet. Watch a video.</p>"
  return

 }

 const keywords = JSON.parse(stored)

 try{

  const query = keywords.join(" ")

  const res = await fetch(
   `${API}/search?q=${encodeURIComponent(query)}`
  )

  const videos = await res.json()

  container.innerHTML = ""

  videos.slice(0,6).forEach(v => {

   const div = document.createElement("div")

   div.className = "video-card"

   div.onclick = () => {

    window.location =
    `watch.html?video=${encodeURIComponent(v.videoUrl)}`

   }

   div.innerHTML = `
     <video class="preview" muted preload="metadata">
       <source src="${v.videoUrl}" type="video/mp4">
     </video>
     <p class="video-title">${fileName(v.videoUrl)}</p>
   `

   container.appendChild(div)

  })

 }catch(err){

  console.error(err)
  container.innerHTML = "Recommendation failed"

 }

}

async function searchVideos(){

 const query = document.getElementById("searchInput").value.trim()

 if(!query){
  loadAllVideos()   // if empty search, restore all videos
  return
 }

 const container = document.getElementById("allVideos")

 container.innerHTML = "Searching..."

 try{

  const res = await fetch(
   `${API}/search?q=${encodeURIComponent(query)}`
  )

  const videos = await res.json()

  renderVideos(videos)   // update ONLY All Videos section

 }catch(err){

  console.error(err)
  container.innerHTML = "Search failed"

 }

}

function renderVideos(videos){

 const container = document.getElementById("allVideos")

 container.innerHTML = ""

 if(!videos || videos.length === 0){
  container.innerHTML = "No videos found"
  return
 }

 videos.forEach(v => {

  const div = document.createElement("div")

  div.className = "video-card"

  div.onclick = () => {
   window.location =
   `watch.html?video=${encodeURIComponent(v.videoUrl)}`
  }

  div.innerHTML = `
   <video class="preview" muted preload="metadata">
     <source src="${v.videoUrl}" type="video/mp4">
   </video>

   <p class="video-title">${fileName(v.videoUrl)}</p>
  `

  container.appendChild(div)

 })

}

document
.getElementById("searchInput")
.addEventListener("input",function(){

 if(this.value === ""){
  loadAllVideos()
 }

})

document
.getElementById("searchInput")
.addEventListener("keypress",function(e){

 if(e.key === "Enter"){
  searchVideos()
 }

})

/* -------------------------
Start
--------------------------*/

loadHome()