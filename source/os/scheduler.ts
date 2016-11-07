module TSOS {
    export class Scheduler {
    	schType : string
    	quantum : number
    	curQuan : number
        constructor(public type="rr",public defaultquantum=3) {
        	this.schType=type;
        	this.quantum=defaultquantum;
        	this.curQuan=0;
        }


        public callScheduler(){
        		console.log("callScheduler")
                switch (this.schType) {
                	case "rr":{
                		//if(this.curQuan>=this.quantum){
                			console.log("inside if of scheduler")
                			this.contextSwitch();
                			this.curQuan=0;
                		
                		
                		break;
                	}
                	case "fcfs":
                		break
        	 
        	}

    	}

    	public contextSwitch(){
    		 
    		  
    		console.log("contextSwitch")
    		
    		var PCB = _ProcessManager.runningQueue.dequeue();
    		console.log("running queue context switch"+_ProcessManager.runningQueue.getSize()+"readyqueue size is  "+_ProcessManager.readyQueue.getSize())
    		if((!_ProcessManager.readyQueue.isEmpty())&&_ProcessManager.runningQueue.isEmpty()){
    			console.log("newPCB being enqueued")
    			var newPCB= _ProcessManager.readyQueue.dequeue;
    			console.log(newPCB);
    			_ProcessManager.runningQueue.enqueue(newPCB)
    			 _CPU.updateCurPcb();


    			 


    		}
    		
    		//var newPCB=_ProcessManager.readyQueue.dequeue;
    		//_ProcessManager.runningQueue.enqueue(newPCB);
    		
    	}

    }
}