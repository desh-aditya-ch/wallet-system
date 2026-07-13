const JobQueue=require("./JobQueue");

class InMemoryJobQueue extends JobQueue{
    constructor(){
        super();
        this.jobs=[];
    }

    enqueue(job){
        this.jobs.push(job);
    }

    dequeue(job){
        return this.jobs.shift();
    }

    isEmpty(){
        return this.jobs.length===0;
    }
}

module.exports=InMemoryJobQueue;