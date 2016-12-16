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
    	public load(priority){
            //alert(_MemoryManager.allocated.length)

            if(priority.length==0){
                priority=5;
            }
            console.log("resident LIST SIZE "+this.residentList.length)
            if(this.residentList.length<3){
            		var pcb = new Pcb();     		
                    pcb.Pid= allPcb.length;
                    pcb.priority=priority;
                    
                    this.residentList.push(pcb);

                    for(var i=0; i<this.residentList.length; i++){
                        if(this.residentList[i].Pid==pcb.Pid){
                             pcb= this.residentList[i];  
                                
                        }
                    
                    }
                   // alert(this.residentList);

                    _MemoryManager.allocateMem(pcb.Pid);

                    //  console.log("load pcb baseReg is "+pcb.baseRegister)
                    return pcb;
            }
            else{
                _StdOut.putText("Memory is already full.",true);
                return null;
            }
    
                        
    	}
        //loadtodisc
        public loadToDisk(priority){
            //alert(_MemoryManager.allocated.length)

            if(priority.length==0){
                priority=5;
            }
            var hexCode=(<HTMLTextAreaElement>document.getElementById("taProgramInput")).value;
            var pcb = new Pcb();             
            pcb.Pid= allPcb.length;
            pcb.priority=priority;
            pcb.onDisk=true;
            this.residentList.push(pcb);
            var fileName=priority+"pcb"+pcb.Pid;
            var hex="";
            var result = "";
            for (var i=0; i<fileName.length; i++) {
                hex = fileName.charCodeAt(i).toString(16);
                    
                result += (hex)
            }

            _krnHardDriveDriver.createFile(result,false);
            _StdOut.advanceLine();
            allPcb.push(pcb);
            _krnHardDriveDriver.writeToDrive(fileName,hexCode);
            _StdOut.advanceLine();
            _StdOut.putText("The Program has been loaded with PID: "+ pcb.Pid,true);

           
           // _krnHardDriveDriver.writeToDrive()

    
                        
        }


        public translateMemToDisk(pid){
            var finalData=""              
                var found=false;
                while(!found){
                    var i=0
                    var swapedprocess=this.residentList[i]
                    
                        if(swapedprocess.Pid==pid){
                           
                            found=true;
                            swapedprocess.onDisk=true;
                             swapedprocess.baseRegister=-1;
                              swapedprocess.limitRegister=-1;
                            this.residentList[i]=swapedprocess
                        }
                        else{
                            i++
                        }
                    
                }
                var memoryScan=swapedprocess.baseRegister
                while(memoryScan<=swapedprocess.limitRegister){
                   finalData+=document.getElementById("cell"+memoryScan)
                   memoryScan++
                }
                var fileName=swapedprocess.priority+"pcb"+swapedprocess.Pid;
                alert(fileName)
               _Memory.clearMemSeg(swapedprocess);

               var hexName=""
               for(var i=0;i<fileName.length;i++){
                   hexName+=fileName.charCodeAt(i).toString(16)
               }
               var inputData=""
               for(var i=0;i<finalData.length;i++){
                   inputData+=finalData.charCodeAt(i).toString(16)
               }
               _krnHardDriveDriver.createFile(hexName,true);
               _StdOut.advanceLine();
               
               
               _krnHardDriveDriver.writeToDrive(fileName,inputData);



            // }
        }


    	//run a program by putting it into the readque and telling the cpu to run by setting it to executing
    	public runPid(pid){
            
            for(var i=0; i<this.residentList.length; i++){
                if(this.residentList[i].Pid==pid){    
                    
                    var pcb= this.residentList[i];
                    alert("found in run")
                    break;
                }
                
                
            }
            
            
    		
            if(!pcb.onDisk){
                for(var i=0; i<this.residentList.length; i++){
                    if(this.residentList[i].Pid==pid){
                       console.log("splice")
                        this.residentList.splice(i,1);  
                        break;
                    }
                    
                }
           
                this.readyQueue.enqueue(pcb);
            }
            else{
                 var toRemove=this.removePicker();
                 if(toRemove!=null){
                     this.translateMemToDisk(toRemove);
                 }
                 
                _MemoryManager.allocateMem(pid);
                    for(var i=0; i<this.residentList.length; i++){
                        if(this.residentList[i].Pid==pid){
                           console.log("splice")
                            this.residentList.splice(i,1);  
                            break;
                        }
                    }    
                    this.readyQueue.enqueue(pcb);
            }
            document.getElementById('processTable').innerHTML+="<tr id=pidrow"+pcb.Pid+"> <td id='pcbs_PID"+pcb.Pid+"'>"+pcb.Pid+"</td> <td id='pcbs_Status"+pcb.Pid+"'>"+pcb.isExecuting+"</td> <td id='pcbs_PC"+pcb.Pid+"'>0</td></tr>";
                  
            if(this.runningQueue.isEmpty()){
                var inToRunning=this.readyQueue.dequeue()
                if(inToRunning.onDisk){
                    
                    this.runFromDisk(inToRunning);

                }
                this.runningQueue.enqueue(inToRunning);
                
                // alert(this.runningQueue[0]);
        		_CPU.loadFromPcb(this.runningQueue.q[0]);	
                // console.log("resident list After Running" +this.residentList.length);
        		document.getElementById('pcbs_Status'+_CPU.curPCB.Pid).innerText="true";

            }
            
    	}
    	//stop the cpu from runnning once it runs out of things to run
    	public terminateProcess(){
           // document.getElementById('pcbTable').innerHTML=""
           //update the process table by removing the program that just finished from it 
            var newtable="<tr style=\"text-align: center\"><th>PID</th><th>Running</th><th>PC</th></tr>";
            
             for(var i= 0 ; i<this.readyQueue.getSize();i++)   {
                
                 newtable+="<tr id=pidrow"+this.readyQueue.q[i].Pid+"> <td id='pcbs_PID"+this.readyQueue.q[i].Pid+"'>"+this.readyQueue.q[i].Pid+"</td> <td id='pcbs_Status"+this.readyQueue.q[i].Pid+"'>"+this.readyQueue.q[i].isExecuting+"</td> <td id='pcbs_PC"+this.readyQueue.q[i].Pid+"'>"+this.readyQueue.q[i].PC+"</td></tr>";
                
             }

             document.getElementById('processTable').innerHTML=newtable;
             //take the curPCB and set its values = to what the pu has in it
            _CPU.updateCurPcb();
            //update the PCB in the running queue to these values
            _ProcessManager.runningQueue.q[0]=_CPU.curPCB;
            //clear and deallocate the memory that this pcb uses
            _Memory.clearMemSeg(_CPU.curPCB);
    		//_CPU.isExecuting= false;
            
            // console.log("running queue "+ this.runningQueue.getSize())
            //de queue it    
            var rempcb= this.runningQueue.dequeue();
            
            // console.log("running queue "+ this.runningQueue.getSize())
            //add it to our finished queue           
            this.finishedQueue.enqueue(rempcb);
            // console.log("resident list After Terminate" +this.residentList.length)
            // console.log("isExecuting "+_CPU.isExecuting)
            // console.log("running queue size"+ this.runningQueue.getSize())

            //if the ready queue isnt empty and the running queue is thene want to deqeue from ready and enqueue onto running 
            if(!this.readyQueue.isEmpty()&&this.runningQueue.isEmpty()){

                console.log("we enqueued after terminating");
                if(_Scheduler.schType=="priority"){
                    this.priorityRun();
                }
                else{
                this.runningQueue.enqueue(this.readyQueue.dequeue())
                }
                _CPU.loadFromPcb(this.runningQueue.q[0]);    

              
            
            }
            //otherwise set the _CPU execute to false so we show that it is idle in the trace
            else
                _CPU.isExecuting= false;

    	}


        public killReadyProcess(pid){
           
            var rempcb;
                //if whats in the running queue is the pid we want to kill we dequeue it
              
               //else we want to loop through the ready queue and find if the pid is in there
               //if it is we dequeue it 
               
           for(var i=0; i<this.readyQueue.getSize();i++){
               if(this.readyQueue.q[i].Pid!=pid){
                  this.readyQueue.enqueue(this.readyQueue.dequeue());
               }
               else{
                   rempcb=this.readyQueue.dequeue();
               }

            }
               
               //update the process table to reflect our changes
                this.updateProcessTable()
                //clear memory space of the process that was killed
                 _Memory.clearMemSeg(rempcb);
                //_CPU.isExecuting= false;
               
               
               
              
               //add to our finished queue
                this.finishedQueue.enqueue(rempcb);
                  _StdOut.putText("PID "+rempcb.Pid+" has been terminated.", true)
                  //inform the user that the item deleted succesfully
                  _StdOut.advancedLine();

                 
                
                
                
        }
        public killRunningProcess(pid){
            if(this.runningQueue.q[0].Pid==pid){
                var rempcb= this.runningQueue.dequeue()
            }
               //add to our finished queue
            this.terminateProcess()

        }     


        public updateProcessTable(){
            var newtable="";
                 for(var i= 0 ; i<this.readyQueue.getSize();i++)   {
                   
                     newtable+="<tr id=pidrow"+this.readyQueue.q[i].Pid+"> <td id='pcbs_PID"+this.readyQueue.q[i].Pid+"'>"+this.readyQueue.q[i].Pid+"</td> <td id='pcbs_Status"+this.readyQueue.q[i].Pid+"'>"+this.readyQueue.q[i].isExecuting+"</td> <td id='pcbs_PC"+this.readyQueue.q[i].Pid+"'>"+this.readyQueue.q[i].PC+"</td></tr>";
                    
                 }

                 if(!this.runningQueue.isEmpty()){
                     newtable+="<tr id=pidrow"+this.runningQueue.q[0].Pid+"> <td id='pcbs_PID"+this.runningQueue.q[0].Pid+"'>"+this.runningQueue.q[0].Pid+"</td> <td id='pcbs_Status"+this.runningQueue.q[0].Pid+"'>"+this.runningQueue.q[0].isExecuting+"</td> <td id='pcbs_PC"+this.runningQueue.q[0].Pid+"'>"+this.runningQueue.q[0].PC+"</td></tr>";
                    
                 }
                 document.getElementById('processTable').innerHTML=newtable
        }
        public priorityRun(){
            var lowestPriority=_ProcessManager.readyQueue.dequeue();
                    var curCheckPcb;
                    for(var i=0;i<_ProcessManager.readyQueue.getSize();i++){
                        curCheckPcb=_ProcessManager.readyQueue.dequeue();
                        if(lowestPriority.priority>curCheckPcb.priority){
                            _ProcessManager.readyQueue.enqueue(lowestPriority);
                            lowestPriority=curCheckPcb;

                        }
                        else if(lowestPriority.priority=curCheckPcb.priority&& lowestPriority.waitTime<curCheckPcb.waitTime){
                            _ProcessManager.readyQueue.enqueue(lowestPriority);
                            lowestPriority=curCheckPcb;
                        }
                        else{
                            _ProcessManager.readyQueue.enqueue(curCheckPcb);
                            
                        }
                    }
                    _ProcessManager.runningQueue.enqueue(lowestPriority);
        }

        public runFromDisk(pcb){
            var searchPointer="000"
            var searchName="pcb"+pcb.Pid;
          

            
            while(searchPointer!="101"){
                      
                var hexName=sessionStorage.getItem(searchPointer);
                var transName=""
                for(var i=0; i<hexName.length;i=i+2){
                    transName += String.fromCharCode(parseInt(hexName.substr(i, 2), 16)).replace(/[^a-zA-Z0-9]/g, "");
                   
                }
                if(searchPointer=="100"){
                     _StdOut.putText(pcb.pid+" cannot be found in local or disk memory.", true)
                    
                    break
                }
                 
                if(searchName==transName.substr(1)){
                    alert("matchs")
                   
                    _krnHardDriveDriver.swapMem(searchPointer,pcb.baseRegister,pcb.limitRegister);
                    _krnHardDriveDriver.deleteFile(hexName.substr(4))
                    break

                }
                else{
                    searchPointer=_krnHardDriveDriver.searchPointerIncrement(searchPointer);
                }
            }



        }
        public removePicker(){
            if(_MemoryManager.allocated.length>=3){
                if(this.residentList.length>0){
                    return this.residentList[0].Pid
                }
                else{
                    for(var i=0;i<this.readyQueue.getSize();i++){
                        var curPCB= this.readyQueue.dequeue();
                        this.readyQueue.enqueue(curPCB);
                    }
                    return curPCB.Pid
                }

            }


        }

    }
}