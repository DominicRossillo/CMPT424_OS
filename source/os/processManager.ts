module TSOS {
	//manages running and terminating processes
    export class ProcessManager {

    	readyQueue : Queue;
        residentList : Array<Pcb>;
    	
    	constructor() {
    		this.readyQueue= new Queue();
    		this.residentList=[]
           
        }
        //load a pcb into resident que 
    	public load(){
    		var pcb = new Pcb();     		
            pcb.Pid= this.residentList.length;
            this.residentList[pcb.Pid]=pcb;
            document.getElementById('pcbTable').innerHTML+="<tr> <td id='pcbs_PID"+pcb.Pid+"'>"+pcb.Pid+"</td> <td id='pcbs_Status"+pcb.Pid+"'>"+pcb.isExecuting+"</td> <td id='pcbs_PC"+pcb.Pid+"'>0</td></tr>";
            return pcb;
                        
    	}
    	//run a program by putting it into the readque and telling the cpu to run by setting it to executing
    	public runPid(pid){
    		var pcb= this.residentList[pid]
    		this.readyQueue.enqueue(pcb);
    		_CPU.curPCB=pcb;
    		pcb.isExecuting=true;
    		_CPU.loadFromPcb(pcb);
    		_CPU.isExecuting=true;
    		

    		document.getElementById('pcbs_Status'+pid).innerText=""+pcb.isExecuting

    // 		newrow.insertCell(0).innerText=""+pid;
 			// newrow.insertCell(1).innerText
 			// newrow.insertCell(2);

    	}
    	//stop the cpu from runnning once it runs out of things to run
    	public terminateProcess(){
    		_CPU.isExecuting= false;

    	}


    }
    }	