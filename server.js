const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

// ✅ allow only your frontend
app.use(cors({
  origin: "https://freeblaze.kesug.com"
}));

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// 🔥 MAIN API (direct link extract)
app.post("/download", (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  console.log("Fetching link:", url);

  exec(
    `python3 -m yt_dlp -f best -g "${url}"`,
    (err, stdout, stderr) => {

      console.log("STDOUT:", stdout);
      console.log("STDERR:", stderr);

      if (err) {
        return res.status(500).json({
          error: stderr || "Failed to fetch link"
        });
      }

      const directLink = stdout.trim();

      res.json({
        success: true,
        download_url: directLink
      });
    }
  );
});

// render port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
