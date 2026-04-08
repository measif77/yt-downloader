const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();

// ✅ Only allow your frontend domain
app.use(cors({
  origin: "https://freeblaze.kesug.com"
}));

app.use(express.json());

app.post('/download', (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  const fileName = `video_${Date.now()}.mp4`;

  // yt-dlp command
  exec(`yt-dlp -f best -o "${fileName}" ${url}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Download failed" });
    }

    // send file
    res.download(fileName, () => {
      // delete file after sending
      fs.unlink(fileName, () => {});
    });
  });
});

// ✅ Important for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
