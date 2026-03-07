const API = "http://localhost:3000"

/* -----------------------------
Utility functions
------------------------------*/

function getQuery(name){

 const params = new URLSearchParams(window.location.search)
 return params.get(name)

}

function fileName(url){

 const name = url.split("/").pop()
 return name.replace(".mp4","")

}

/* -----------------------------
Load video player
------------------------------*/

async function loadPlayer(){

 const videoUrl = decodeURIComponent(getQuery("video"))

 const player = document.getElementById("player")

 player.src = videoUrl

 const res = await fetch("http://localhost:3000/videos")
 const videos = await res.json()

 const currentVideo = videos.find(v => v.videoUrl === videoUrl)

 if(currentVideo){

  /* save last watched video keywords */

  localStorage.setItem(
    "lastKeywords",
    JSON.stringify(currentVideo.keywords)
  )

 }

 document.getElementById("videoTitle").innerText =
 videoUrl.split("/").pop().replace(".mp4","")

 loadRecommendations(videoUrl)

}

/* -----------------------------
Load recommendations
------------------------------*/

async function loadRecommendations(videoUrl){

 try{

  const res = await fetch(`${API}/videos`)
  const videos = await res.json()

  /* find metadata for current video */

  const currentVideo = videos.find(v => v.videoUrl === videoUrl)

  if(!currentVideo){

   console.log("Video metadata not found")
   return

  }

  /* use keywords as search query */

  const keywordQuery = currentVideo.keywords
     ? currentVideo.keywords.join(" ")
     : fileName(videoUrl)

  /* query Azure AI Search */

  const recRes = await fetch(

   `${API}/search?q=${encodeURIComponent(keywordQuery)}`

  )

  const recVideos = await recRes.json()

  displayRecommendations(recVideos, videoUrl)

 }catch(err){

  console.error(err)

 }

}

/* -----------------------------
Display recommendation list
------------------------------*/

function displayRecommendations(videos,currentUrl){

 const container = document.getElementById("recommendations")

 container.innerHTML = ""

 videos
  .filter(v => v.videoUrl !== currentUrl)   // remove current video
  .slice(0,6)                               // show top results
  .forEach(v => {

   const div = document.createElement("div")

   div.className = "side-video"

   div.onclick = () => {

    window.location =
    `watch.html?video=${encodeURIComponent(v.videoUrl)}`

   }

   div.innerHTML = `

   <video class="side-preview" muted preload="metadata">
     <source src="${v.videoUrl}" type="video/mp4">
   </video>

   <span>${fileName(v.videoUrl)}</span>

   `

   container.appendChild(div)

 })

}

/* -----------------------------
Initialize page
------------------------------*/

loadPlayer()