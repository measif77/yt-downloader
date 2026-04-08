const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();

// ✅ allow only your frontend
app.use(cors({
  origin: "https://freeblaze.kesug.com"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/download", (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  const fileName = `video_${Date.now()}.mp4`;

  exec(`yt-dlp -f best -o "${fileName}" "${url}"`, (err, stdout, stderr) => {
    if (err) {
      console.log(stderr);
      return res.status(500).json({ error: "Download failed" });
    }

    res.download(fileName, () => {
      fs.unlink(fileName, () => {});
    });
  });
});

// ✅ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
