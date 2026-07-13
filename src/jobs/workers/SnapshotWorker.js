class SnapshotWorker{
    constructor(queue,snapshotService){
        this.queue=queue;
        this.snapshotService=snapshotService;
    }

    async processNextJob(){
        if(this.queue.isEmpty()){
            return;
        }

        const job=this.queue.dequeue();

        switch(job.type){
            case "SNAPSHOT":
                await this.snapshotService.createSnapshot(job.walletId);
                break;
            default:
                throw new Error(`unknown job type:${job.type}`);
        }
    }
}