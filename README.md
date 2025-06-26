# Spotify Clone – Local Version 🎧

This is a frontend clone of Spotify’s web player designed specifically for local use (e.g., in VS Code with Live Server). It features a working audio player and dynamic playlist rendering. Unlike the GitHub Pages version, this build directly scans folders to detect playlists and songs. JSON is used only for displaying extra playlist details like titles and descriptions.

> ⚠️ This version is **not compatible with GitHub Pages** due to browser security restrictions on accessing directory structures.

---

## 🔧 Tech Stack
- HTML5
- CSS3 (Flexbox)
- JavaScript (DOM, Events, Audio API, `fetch`)
- Live Server (for local testing)

---

## 📱 Features
- Sidebar with automatically listed playlists (based on folders)
- Songs fetched from folder contents (no hardcoding)
- Playlist title and description fetched from `info.json` inside each playlist folder
- Audio player with:
  - Play/Pause controls
  - Track name, artist, and album cover
  - Seekbar synced with duration
  - Volume adjustment

---

## 📁 Data Handling
- Playlists are folders inside the `songs/` directory (e.g., `Arijit\ Singh`)
- Each folder contains:
  - `.mp3` files for songs
  - `cover.jpg` for artwork
  - `info.json` with playlist-level metadata (title, description)
- JavaScript scans the folders and populates the UI dynamically (no hardcoded song list)
- All song and cover files are accessed as static files

---

## 🚫 Limitations
- ❌ Does not work on GitHub Pages (due to lack of direct folder access in hosted browsers)
- ❌ No backend, login, search, or sync features
- ❌ Works best in Chromium-based browsers (e.g., Chrome, Edge)

---

## 🧪 How to Run
1. Clone or download the repo
2. Open in **VS Code**
3. Right-click `index.html` → **Open with Live Server**
4. Use locally in your browser

---

## 🚀 Live GitHub Version (Alternative)
If you want a GitHub-hosted version that uses JSON for all data, visit:  
👉 [Spotify Clone (GitHub version)](https://pjha91275.github.io/Spotify-Clone/)

---

## 📁 Folder Structure
Spotify-Clone-Local/
│
├── index.html
├── favicon.ico
│
├── CSS/
│ ├── style.css
│ └── utility.css
│
├── JS/
│ └── script.js
│
├── SVG/
│ ├── play.svg
│ ├── pause.svg
│ ├── nextsong.svg
│ ├── prevsong.svg
│ ├── ...
│
├── songs/
│ ├── Arijit_Singh/
│ │ ├── info.json
│ │ ├── cover.jpg
│ │ ├── Apna_Bana_Le.mp3
│ │ ├── ...
│ ├── B_Praak/
│ │ ├── info.json
│ │ ├── cover.jpg
│ │ ├── ...
│ └── ...
│
├── songsThumbnail/
│ ├── Arijit_Singh/
│ │ ├── Apna_Bana_Le.jpeg
│ │ ├── ...
│ ├── B_Praak/
│ │ ├── ...
│ └── ...
│
├── README.md


---

## ✍️ Author
**Prince Jha**
