const snapshotWorker=require("./workers/snapshot.worker");

snapshotWorker.start();

console.log("Snapshot Worker Started Succesfully");
