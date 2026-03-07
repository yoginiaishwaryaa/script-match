import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const endpoint = process.env.SEARCH_ENDPOINT;
const key = process.env.SEARCH_KEY;
const index = process.env.SEARCH_INDEX;
const storage = process.env.STORAGE_ACCOUNT;
const container = process.env.CONTAINER;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

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
        videoUrl: `https://${storage}.blob.core.windows.net/${container}/${filename}`,
        keywords: v.keywords
      };
    });

    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error.response?.data || error);
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
      const filename = v.title.split("/").pop();
      const name = filename.replace(".mp4", "");
      return {
        id: v.id,
        videoUrl: `https://${storage}.blob.core.windows.net/${container}/${filename}`,
        name: name,
        keywords: v.keywords
      };
    });

    res.json(videos);
  } catch (error) {
    console.error("Search error:", error.response?.data || error);
    res.status(500).send("Error performing search");
  }
});

app.get("/recommend/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  try {
    const response = await axios.get(
      `${endpoint}/indexes/${index}/docs?search=${keyword}&api-version=2020-06-30`,
      {
        headers: { "api-key": key }
      }
    );

    const videos = response.data.value.map(v => {
      const filename = v.title.split("/").pop();
      return {
        videoUrl: `https://${storage}.blob.core.windows.net/${container}/${filename}`,
        keywords: v.keywords
      };
    });

    res.json(videos);
  } catch (err) {
    console.error("Recommendation error:", err.response?.data || err);
    res.status(500).send("Error fetching recommendations");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
