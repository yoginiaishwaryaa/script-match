import express from "express"
import axios from "axios"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const endpoint = process.env.SEARCH_ENDPOINT
const key = process.env.SEARCH_KEY
const index = process.env.SEARCH_INDEX
const storage = process.env.STORAGE_ACCOUNT
const container = process.env.CONTAINER

function formatVideo(v){

 const filename = v.videoUrl?.split("/").pop()

 return {

  id: v.id,

  videoUrl:`https://${storage}.blob.core.windows.net/${container}/${filename}`,

  transcript:v.transcript,

  keywords:v.keywords,

  topics:v.topics

 }

}

app.get("/videos", async (req, res) => {

  try {

    const response = await axios.get(
      `${endpoint}/indexes/${index}/docs?search=*&api-version=2020-06-30`,
      {
        headers: { "api-key": key }
      }
    );

    const videos = response.data.value.map(v => {

      const filename = v.title.split("/").pop();

      return {
        id: v.id,
        videoUrl: `https://videosproject.blob.core.windows.net/raw-videos/${filename}`,
        keywords: v.keywords
      };

    });

    res.json(videos);

  } catch (error) {

    console.log(error.response?.data || error);
    res.status(500).send("Error fetching videos");

  }

});

app.get("/search", async (req, res) => {

  const q = req.query.q;

  try {

    const response = await axios.get(
      `${endpoint}/indexes/${index}/docs?search=${q}&api-version=2020-06-30`,
      {
        headers: { "api-key": key }
      }
    );

    const videos = response.data.value.map(v => {

    const filename = v.title.split("/").pop()

    const name = filename.replace(".mp4","")

    return {

        id: v.id,
        videoUrl: `https://videosproject.blob.core.windows.net/raw-videos/${filename}`,
        name: name,
        keywords: v.keywords

    }

    });

    res.json(videos);

  } catch (error) {

    res.status(500).send(error);

  }

});

app.get("/recommend/:keyword", async (req,res)=>{

const keyword=req.params.keyword

try{

const response=await axios.get(

`${endpoint}/indexes/${index}/docs?search=${keyword}&api-version=2020-06-30`,

{
headers:{
"api-key":key
}
}

)

const videos=response.data.value.map(v=>{

const filename=v.title.split("/").pop()

return{

videoUrl:`https://videosproject.blob.core.windows.net/raw-videos/${filename}`,
keywords:v.keywords

}

})

res.json(videos)

}catch(err){

console.log(err)

res.status(500).send("error")

}

})

app.listen(process.env.PORT,()=>{
 console.log("Server running on port",process.env.PORT)
})