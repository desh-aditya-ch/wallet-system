const {Worker}=require("bullmq");

const redis=require("../config/redis");
const walletService=require("../services/wallet.service");

class SnapshotWorker {
    start() {
        this.worker = new Worker(
            "snapshot-queue",
            async (job) => {
                try {
                    console.log("📥 Job Received:", job.name);
                    console.log("📦 Payload:", job.data);

                    const { walletId } = job.data;

                    await walletService.createSnapshot(walletId);

                    console.log("✅ Snapshot Created Successfully");
                } catch (error) {
                    console.error("❌ Snapshot Worker Failed");
                    console.error(error);
                    throw error;
                }
            },
            {
                connection: redis,
            }
        );

        return this.worker;
    }
}

module.exports = new SnapshotWorker();