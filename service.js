const { PrismaClient } = require("@prisma/client");
const { downloadVideo } = require("./downloadVideo");

const prisma = new PrismaClient();

const STATUS_ENUM = {
  PENDING: "pending",
  COMPLETED: "completed",
  ERROR: "error",
};

const inProgressQueue = [];

async function pushToDownloadQueue(data) {
  try {
    let db_ref;
    const alreadyExists = await prisma.download_queue.findFirst({
     where:{
      webpage_url: data.webpageURL,
      status: STATUS_ENUM.PENDING,
     }
    });
    if (!alreadyExists) {
      const new_download = await prisma.download_queue.create({
        data: {
          m3u8_url: data.m3u8URL,
          webpage_url: data.webpageURL,
          filename: data.filename,
          status: STATUS_ENUM.PENDING,
        },
      });
      db_ref = new_download;
    } else {
      db_ref = alreadyExists;
    }
    if(inProgressQueue.includes(db_ref.download_queue_id)){
      throw new Error('Download already in progress');
    }

    inProgressQueue.push(db_ref.download_queue_id);
    
    // Call downloadVideo function asynchronously
    downloadVideo(db_ref.download_queue_id, db_ref.m3u8_url, db_ref.filename).catch((error) => {
      throw error;
    });
    return db_ref;
  } catch (error) {
    if (error.code === "P2002") {
      const uniqueFields = error.meta.target.join(", ");
      error.message = `Please provide unique values for [${uniqueFields}]`;
    }
    console.error("Error in pushToDownloadQueue function:", error.message);
    throw error;
  }
}

async function updateTheQuuedb(download_queue_id, updates) {
  try {
    return await prisma.download_queue.update({
      where: {
        download_queue_id: +download_queue_id,
      },
      data: updates,
    });
  } catch (error) {
    console.error("Error in updateTheQueueDb", error.message);
    throw error;
  }
}

async function getAllQueues() {
  try {
    return await prisma.download_queue.findMany()
  } catch (error) {
    console.error('Error in getAllQueues fn', error.message);
    throw error;
  }
}

module.exports = {
  pushToDownloadQueue,
  updateTheQuuedb,
  getAllQueues
};

// const { PrismaClient } = require("@prisma/client");
// const { downloadVideo } = require("./downloadVideo");

// const prisma = new PrismaClient();

// const STATUS_ENUM = {
//   PENDING: "pending",
//   COMPLETED: "completed",
//   ERROR: "error",
// };

// async function pushToDownloadQueue(data) {
//   try {
//     const new_download = await prisma.download_queue.create({
//       data: {
//         m3u8_url: data.m3u8URL,
//         webpage_url: data.webpageURL,
//         filename: data.filename,
//         status: STATUS_ENUM.PENDING,
//       },
//     });
//     downloadVideo(new_download.m3u8_url, new_download.filename);
//     return new_download;
//   } catch (error) {
//     if (error.code === "P2002") {
//       const uniqueFields = error.meta.target.join(", ");
//       error.message = `Please provide unique values for [${uniqueFields}]`;
//       console.error("Error in pushToDownloadQueue fn", error.message);
//       throw error;
//     }
//     console.error("Error in pushToDownloadQueue fn", error.message);
//     throw error;
//   }
// }

// module.exports = {
//   pushToDownloadQueue,
// };
