const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();

// ✅ Allow only your frontend domain
app.use(cors({
  origin: "https://freeblaze.kesug.com"
}));

app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Download route
app.post("/download", (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  const fileName = `video_${Date.now()}.mp4`;

  console.log("Downloading:", url);

  exec(
    `yt-dlp -f best -o "${fileName}" "${url}"`,
    { timeout: 600000 }, // 10 min timeout
    (err, stdout, stderr) => {

      console.log("STDOUT:", stdout);
      console.log("STDERR:", stderr);

      if (err) {
        console.log("ERROR:", err);
        return res.status(500).json({
          error: stderr || "Download failed"
        });
      }

      // Send file
      res.download(fileName, (downloadErr) => {
        if (downloadErr) {
          console.log("Download error:", downloadErr);
        }

        // Delete file after sending
        fs.unlink(fileName, (unlinkErr) => {
          if (unlinkErr) console.log("Delete error:", unlinkErr);
        });
      });
    }
  );
});

// ✅ Render port fix
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
