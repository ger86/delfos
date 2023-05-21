const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const app = express();
require("dotenv").config();

const privateGptPath = process.env.PRIVATEGPT_PATH;

app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "privategpt/source_documents/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// API endpoint for file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  exec(
    `python3 ingest.py`,
    {
      cwd: privateGptPath,
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send("An error occurred");
      }
      return res.status(200).send("File uploaded successfully");
    }
  );
});

// API endpoint to execute a python script
app.post("/execute", (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).send("No text provided");
  }

  exec(
    `python3 oneShot.py --query "${query} -S -M"`,
    {
      cwd: privateGptPath,
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send("An error occurred");
      }
      return res.status(200).send({ answer: stdout });
    }
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
