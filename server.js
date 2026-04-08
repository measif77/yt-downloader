const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.post('/download', (req, res) => {
  const url = req.body.url;

  if (!url) return res.json({ error: "No URL provided" });

  const fileName = `video_${Date.now()}.mp4`;

  exec(`yt-dlp -f best -o ${fileName} ${url}`, (err) => {
    if (err) return res.json({ error: "Download failed" });

    res.download(fileName);
  });
});

app.listen(3000, () => console.log("Server running"));