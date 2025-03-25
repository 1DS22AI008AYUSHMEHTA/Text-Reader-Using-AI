const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");


mongoose.connect("mongodb://localhost:27017/ocrDatabase", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const ocrSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const OcrResult = mongoose.model("OcrResult", ocrSchema);

app.post("/ocr", async (req, res) => {
  try {
    const { text } = req.body;
    const newOcrResult = new OcrResult({ text });
    await newOcrResult.save();
    res.status(200).json({ message: "OCR text saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving OCR text", error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


