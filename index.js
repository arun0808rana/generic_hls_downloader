const express = require("express");
const cors = require("cors");
const { handleDTOerrors } = require("./helper");
const { pushToDownloadQueue, updateTheQuuedb, getAllQueues } = require("./service");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  const response = {
    data: null,
    error: false,
  };
  try {
    const downloadDTO = {
      m3u8URL: req.body.m3u8URL,
      webpageURL: req.body.webpageURL,
      filename: req.body.filename,
    };
    handleDTOerrors(downloadDTO);
    response.data = await pushToDownloadQueue(downloadDTO);
  } catch (error) {
    response.error = error.message;
    console.error("Error in download route", error.message);
  }
  res.json(response);
});

app.patch("/update-status/:updateId", async (req, res) => {
  const response = {
    data: null,
    error: false,
  };
  try {
    const updateId = req.params.updateId;
    const updateDTO = req.body;
    response.data = updateTheQuuedb(updateId, updateDTO)
  } catch (error) {
    response.error = error.message;
    console.error("Error in update-status route", error.message);
  }
  res.json(response);
});

app.get("/get-queues", async (req, res) => {
  const response = {
    data: null,
    error: false,
  };
  try {
    response.data = await getAllQueues();
  } catch (error) {
    response.error = error.message;
    console.error("Error in get-queues route", error.message);
  }
  res.json(response);
});

const PORT = process.env.PORT || 6960;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
