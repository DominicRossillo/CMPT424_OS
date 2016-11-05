module TSOS {
	//manages running and terminating processes
    export class MemoryManager {

        memorySize : number;
        allocated : Array<Pcb>;


        
        
        constructor() {
            this.memorySize=_Memory.memory.length;
            this.allocated= new Array();
       //     this.memorySize=_Memory.memory.size           
           
        }

        public  allocateMem(pid){
            alert("resident list length "+_ProcessManager.residentList.length)
            for(var i=0; i<_ProcessManager.residentList.length; i++){
                if(_ProcessManager.residentList[i].Pid==pid){
                    var pcb= _ProcessManager.residentList[i]
                    break;
                }
                
            }
            
            var freeMem=this.findFreeMem();
            alert(freeMem)
            //alert("allocate length is "+this.allocated.length)
            if (freeMem.length>0){
                var freebase =parseInt(freeMem[0]);
              //  alert("free base "+freebase);
                var freelimit= freebase+255
             //   alert("free limit "+freelimit);
                pcb.baseRegister=freebase
                pcb.limitRegister=freelimit
                _ProcessManager.residentList[pid]=pcb;

            }      
            // if (this.allocated.length==2){
            //       pcb.baseRegister=512
            //       pcb.limitRegister=767
            //       this.allocated[2]=pcb
            // }
            // else if (this.allocated.length==1){
            //       pcb.baseRegister=256
            //        pcb.limitRegister=511
            //        this.allocated[1]=pcb
            // }
            // else{
            //     pcb.baseRegister=0
            //     pcb.limitRegister=255
            //     this.allocated[0]=pcb

            // }

           
                        
        }

        public deAllocateMem(pid){

            for (var i=0; i <this.allocated.length;i++){
               var curSeg= this.allocated[i]
               alert(" curSeg = "+curSeg)
               alert(" pid = "+pid)
                if(curSeg.Pid==pid){
                    alert("deAlocated "+curSeg.baseRegister)
                    this.allocated.splice(i,1);
                    
                }
                break;

            }
           

        }
        public findFreeMem(){
           var usedSegments=[];
           var allSegments= ["0","256","512"];
           var allfound=[];

           for (var i=0; i<_ProcessManager.residentList.length && _ProcessManager.residentList.length>0;i++){
//alert("residentList is this big:"+_ProcessManager.residentList.length)
               usedSegments.push(_ProcessManager.residentList[i].baseRegister);
//alert("usedSegments has " +usedSegments)
           }
           for (var i=0; i<_ProcessManager.readyQueue.getSize() && !_ProcessManager.readyQueue.isEmpty();i++){
             //  alert("ready queue is this big:"+_ProcessManager.readyQueue.getSize())
               usedSegments.push(_ProcessManager.readyQueue.q[i].baseRegister);
//alert("usedSegments has " +usedSegments)
           }
           if(_ProcessManager.runningQueue.getSize()>0){
               usedSegments.push(_ProcessManager.runningQueue.q[0].baseRegister);
           }
           for (var i=0; i<allSegments.length; i++){
               var missingSeg= true;
             //  alert("usedSegments size"+ usedSegments.length)    
               for(var j=0; j<usedSegments.length;j++){
                       if(usedSegments[j]==allSegments[i]){
                           missingSeg= false;
                         //  alert("found " +allSegments[i])
                           break;
                       }
                       

               }
               if(missingSeg==true){

                   allfound.push(allSegments[i]);
                 //alert("all missing segments"+ allSegments[i])
               }
               
            }
               alert("all found is "+allfound)
               return allfound;
               
           }
           

        }
    


}	