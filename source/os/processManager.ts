module TSOS {

    export class ProcessManager {

    	readyQueue : Queue;
        residentList : Array<Pcb>;
    	
    	constructor() {
    		this.readyQueue= new Queue();
    		this.residentList=[]
           
        }

    	public load(){
    		var pcb = new Pcb();     		
            pcb.Pid= this.residentList.length;
            this.residentList[pcb.Pid]=pcb;
            
            return pcb;
                        
    	}
    	public runPid(pid){
    		var pcb= this.residentList[pid]
    		this.readyQueue.enqueue(pcb);
    		_CPU.loadFromPcb(pcb);
    		_CPU.isExecuting= true;

    	}

    	public terminateProcess(){
    		_CPU.isExecuting= false;
    	}


    }
    }	