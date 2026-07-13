class JobQueue{
    enqueue(job){
        throw new Error("enqueue() must be implemented");
    }

    dequeue(job){
        throw new Error("dequeue() must be implemented");
    }

    isEmpty(){
        throw new Error("isEmpty() must be implemented");
    }
}

module.exports=JobQueue;