# 🎬 ScriptMatch
### Automated Movie Recommendation via AI Transcription

ScriptMatch is a fully serverless, Azure-native platform that recommends movies based on what's actually *said* in them — not just their genre or manual tags. It uses AI to transcribe movie audio, extract meaningful keywords from the dialogue, and match films that share similar narrative content.

---

## The Problem It Solves

Traditional movie recommendation systems rely on broad genre labels and manually assigned tags. This approach is slow, inconsistent, and misses the richest source of information a movie has — its actual dialogue. ScriptMatch fixes this by automatically analyzing what characters say, extracting key vocabulary, and using that to surface genuinely similar films.

---

## How It Works

### 1. Video Ingestion
A movie is uploaded to **Azure Blob Storage**. This automatically triggers **Azure Event Grid**, which kicks off the processing pipeline via **Azure Logic Apps** — no manual intervention needed.

### 2. AI Transcription & Keyword Extraction
**Azure AI Video Indexer** processes the video and extracts:
- Full transcripts
- Keywords and topics
- Sentiment signals

Each movie ends up with a rich semantic metadata profile built entirely from its content.

### 3. Keyword Indexing
The extracted keywords and metadata are stored in **Azure AI Search**, making every movie fully searchable and comparable by content rather than category.

### 4. Movie Matching & Recommendation
When a user watches a movie, their taste profile is updated in **Azure Cosmos DB** — tracking the genres and keywords they engage with. ScriptMatch then computes similarity between movies (and users) based on shared keyword patterns, surfacing recommendations that are genuinely content-driven.

---

## Azure Services Used

| Service | Role |
|---|---|
| Azure Blob Storage | Stores uploaded video files |
| Azure Event Grid | Detects uploads and triggers workflows |
| Azure Logic Apps | Orchestrates the processing pipeline |
| Azure AI Video Indexer | Transcribes audio and extracts keywords |
| Azure AI Search | Indexes and queries movie metadata |
| Azure Functions | Runs all backend logic (fully serverless) |
| Azure Web App | Hosting web applications, APIs, and mobile backends |

---

## Tech Stack

- **Backend** — Node.js with Express
- **Frontend** — HTML, CSS, Vanilla JavaScript
- **Cloud** — Microsoft Azure (fully serverless, no containers or VMs)

---

## 👥 Team

| Name | GitHub |
|------|--------|
| Reenu L K | [ReenuLK](https://github.com/ReenuLK) |
| Krishna Deepak | [krisndeep](https://github.com/krisndeep) |
| Yogini Aishwaryaa P T S | [yoginiaishwaryaa](https://github.com/yoginiaishwaryaa) |
