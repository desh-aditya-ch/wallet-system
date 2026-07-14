const { Queue } = require("bullmq");
const redis = require("../config/redis");

const queue = new Queue("snapshot-queue", {
    connection: redis,
});

class SnapshotQueue {
    async addSnapshotJob({ walletId}) {
        await queue.add(
            "create-wallet-snapshot",
            {
                walletId,
            }
        );
    }
}

module.exports = new SnapshotQueue();