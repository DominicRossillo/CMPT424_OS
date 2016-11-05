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
            if(this.residentList.length<3){
            		var pcb = new Pcb();     		
                    pcb.Pid= allPcb.length;
                    this.residentList.push(pcb);
                    for(var i=0; i<this.residentList.length; i++){
                        if(this.residentList[i].Pid==pcb.Pid){
                             pcb= this.residentList[i];  
                                
                        }
                    
                    }
                   // alert(this.residentList);

                    _MemoryManager.allocateMem(pcb.Pid);
                    document.getElementById('pcbTable').innerHTML+="<tr> <td id='pcbs_PID"+pcb.Pid+"'>"+pcb.Pid+"</td> <td id='pcbs_Status"+pcb.Pid+"'>"+pcb.isExecuting+"</td> <td id='pcbs_PC"+pcb.Pid+"'>0</td></tr>";
                    return this.residentList[pcb.Pid];
            }
            else{
                _StdOut.putText("Memory is already full.",true);
                return null;
            }
    
                        
    	}
    	//run a program by putting it into the readque and telling the cpu to run by setting it to executing
    	public runPid(pid){

            for(var i=0; i<this.residentList.length; i++){
                if(this.residentList[i].Pid==pid){
                    alert(i)
                    var pcb= this.residentList[i];  
                    break;
                }
                
            }
    		
          //  alert("the pcb "+pcb);
            // alert("before ready queue "+this.readyQueue[0]);
            alert(i)
            this.readyQueue.enqueue(pcb);
            // alert("before length"+this.residentList.length);
            this.residentList.splice(i,1);
            // alert("after length"+this.residentList.length);
    		
            // alert("ready queue "+this.readyQueue[0]);
            //var frontQueue=this.readyQueue.dequeue();
            this.runningQueue.enqueue(this.readyQueue.dequeue());
            // alert(this.runningQueue[0]);
    		_CPU.loadFromPcb(this.runningQueue.q[0]);		
    		document.getElementById('pcbs_Status'+pcb.Pid).innerText=""+this.runningQueue.q[0].isExecuting
    	}
    	//stop the cpu from runnning once it runs out of things to run
    	public terminateProcess(){
             _Memory.clearMemSeg(_CPU.curPCB);
    		_CPU.isExecuting= false;
            alert("running queue "+ this.runningQueue.getSize())
            var rempcb= this.runningQueue.q[0]
            this.runningQueue.dequeue();
            alert("running queue "+ this.runningQueue.getSize())
           
            this.finishedQueue.enqueue(rempcb);

    	}


    }
    }	