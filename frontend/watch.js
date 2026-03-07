const API = window.location.origin;

/* -----------------------------
Utility functions
------------------------------*/

function getQuery(name) {

  const params = new URLSearchParams(window.location.search)
  return params.get(name)

}

function fileName(url) {

  const name = url.split("/").pop()
  return name.replace(".mp4", "")

}

/* -----------------------------
Load video player
------------------------------*/

async function loadPlayer() {

  const videoUrl = decodeURIComponent(getQuery("video"))

  const player = document.getElementById("player")

  player.src = videoUrl

  const res = await fetch(`${API}/videos`)
  const videos = await res.json()

  const currentVideo = videos.find(v => v.videoUrl === videoUrl)

  if (currentVideo) {

    /* save last watched video keywords */

    localStorage.setItem(
      "lastKeywords",
      JSON.stringify(currentVideo.keywords)
    )

  }

  document.getElementById("videoTitle").innerText =
    videoUrl.split("/").pop().replace(".mp4", "")

  loadRecommendations(videoUrl)

}

/* -----------------------------
Load recommendations
------------------------------*/

async function loadRecommendations(videoUrl) {

  try {

    /* query Azure AI Search via backend */

    const lastKeywords = localStorage.getItem("lastKeywords");
    const keywords = lastKeywords ? JSON.parse(lastKeywords) : [];
    const keywordQuery = keywords.length > 0 ? keywords.join(" ") : fileName(videoUrl);

    const recRes = await fetch(
      `${API}/search?q=${encodeURIComponent(keywordQuery)}`
    )

    const recVideos = await recRes.json()

    displayRecommendations(recVideos, videoUrl)

  } catch (err) {

    console.error(err)

  }

}

/* -----------------------------
Display recommendation list
------------------------------*/

function displayRecommendations(videos, currentUrl) {

  const container = document.getElementById("recommendations")

  if (!container) return;

  container.innerHTML = ""

  videos
    .filter(v => v.videoUrl !== currentUrl)   // remove current video
    .slice(0, 6)                               // show top results
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
