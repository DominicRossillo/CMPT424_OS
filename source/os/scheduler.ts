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
                			//_CPU.updateCurPcb()
                			//_ProcessManager.runningQueue.q[0]=_CPU.curPCB;
                		//if(this.curQuan>=this.quantum){
                			if(!_ProcessManager.readyQueue.isEmpty()){
                				console.log("inside if of scheduler")
                				this.contextSwitch();
                			}
                				
                		
                			_CPU.isExecuting=true;	
                			_CPU.updateCurPcb()
                			this.curQuan=0;
                			break;
                	}
                	case "fcfs":
                		break
        	 
        	}

    	}
    	// context switch
    	public contextSwitch(){
    		 
    		    document.getElementById('pcbs_Status'+_CPU.curPCB.Pid).innerText="false"
    			// console.log("contextSwitch")
    			_CPU.updateCurPcb()
    			_ProcessManager.runningQueue.q[0]=_CPU.curPCB;
    			//dequeue the runningqueue
    			var PCB = _ProcessManager.runningQueue.dequeue();
    			// console.log(PCB)
    			//enque the pcb we just removed from running onto ready
    			_ProcessManager.readyQueue.enqueue(PCB)
    			// console.log("running queue context switch"+_ProcessManager.runningQueue.getSize()+"readyqueue size is  "+_ProcessManager.readyQueue.getSize())
    		
    			// console.log("newPCB being enqueued")
    			//remove head of ready 
    			var newPCB= _ProcessManager.readyQueue.dequeue();
    			console.log(newPCB);
    			//enqueue head of ready onto running
    			_ProcessManager.runningQueue.enqueue(newPCB)
    			_CPU.loadFromPcb(_ProcessManager.runningQueue.q[0])




    		
    		
    		//var newPCB=_ProcessManager.readyQueue.dequeue;
    		//_ProcessManager.runningQueue.enqueue(newPCB);
    		
    	}

    }
}