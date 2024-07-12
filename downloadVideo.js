const { exec } = require("child_process");
const path = require("path");

async function downloadVideo(download_queue_id, url, outputFilename) {
  try {
    if (!url) {
      throw new Error("Please provide a HLS stream URL");
    }
    if (!outputFilename) {
      throw new Error(
        "Please provide an output filename for the downloaded media"
      );
    }

    outputFilename = await sanitizeFilename(outputFilename);

    const DOWNLOADS_DIR = process.env.DOWNLOAD_PATH;
    if (!DOWNLOADS_DIR) {
      throw new Error("Please provide the DOWNLOADS_DIR environment variable");
    }
    const outputFilePath = path.join(DOWNLOADS_DIR, `${outputFilename}.mp4`);

    const command = `x-terminal-emulator -e node /home/soydev/dev_profile/nodejs_scripts/ffmpeg_media_downloader/index.js --download_queue_id "${download_queue_id}" --url "${url}" --filename "${outputFilePath}"`;
    exec(command);
  } catch (error) {
    console.error("Error in downloadVideo function", error.message);
    throw error;
  }
}

async function sanitizeFilename(filename) {
  // Characters not allowed in filenames on Unix-based systems (Linux and macOS)
  const unixIllegalChars = /[\/?<>\\:*|"()]/g;

  // Replace illegal characters with underscores
  let sanitizedFilename = filename.replace(unixIllegalChars, "_");

  // Replace spaces and hyphens with underscores
  sanitizedFilename = sanitizedFilename.replace(/[ -]/g, "_");

  return sanitizedFilename;
}

module.exports = {
  downloadVideo,
};
