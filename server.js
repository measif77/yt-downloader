const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// direct link extract (safe method)
app.post("/download", (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  console.log("Fetching:", url);

  exec(
    `python3 -m yt_dlp -f b -g "${url}"`,
    { timeout: 300000 },
    (err, stdout, stderr) => {

      console.log("STDERR:", stderr);

      if (err) {
        return res.status(500).json({
          error: stderr || "Failed"
        });
      }

      const link = stdout.trim();

      res.json({
        success: true,
        download_url: link
      });
    }
  );
});

// port fix
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
