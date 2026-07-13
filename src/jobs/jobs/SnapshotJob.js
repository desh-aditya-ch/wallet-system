class SnapshotJob{
    constructor(walletId){
        this.type="SNAPSHOT";
        this.walletId=walletId;
    }
}

module.exports=SnapshotJob;