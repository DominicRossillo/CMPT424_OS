module TSOS {
	//manages running and terminating processes
    export class ProcessManager {

    	readyQueue : Queue;
        runningQueue : Queue;
        residentList : Array<Pcb>;
        finishedQueue : Queue;
    	
    	constructor() {
    		this.readyQueue= new Queue();
            this.runningQueue= new Queue();
            this.finishedQueue= new Queue();
    		this.residentList=[];
           
        }
        //load a pcb into resident que 
    	public load(){
            //alert(_MemoryManager.allocated.length)
            
        		var pcb = new Pcb();     		
                pcb.Pid= this.residentList.length;
                this.residentList[pcb.Pid]=pcb;
                alert(this.residentList);
                _MemoryManager.allocateMem(pcb.Pid);
                document.getElementById('pcbTable').innerHTML+="<tr> <td id='pcbs_PID"+pcb.Pid+"'>"+pcb.Pid+"</td> <td id='pcbs_Status"+pcb.Pid+"'>"+pcb.isExecuting+"</td> <td id='pcbs_PC"+pcb.Pid+"'>0</td></tr>";
                return this.residentList[pcb.Pid];
            
                
                        
    	}
    	//run a program by putting it into the readque and telling the cpu to run by setting it to executing
    	public runPid(pid){
    		var pcb= this.residentList[pid]
            this.residentList.splice(pid,1);
    		this.readyQueue.enqueue(pcb);
    		_CPU.curPCB=pcb;
    		pcb.isExecuting=true;
    		_CPU.loadFromPcb(pcb);		
    		document.getElementById('pcbs_Status'+pid).innerText=""+pcb.isExecuting
    	}
    	//stop the cpu from runnning once it runs out of things to run
    	public terminateProcess(){
    		_CPU.isExecuting= false;
            var rempcb= this.runningQueue.dequeue
            this.finishedQueue.enqueue(rempcb);

    	}


    }
    }	