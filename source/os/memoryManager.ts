module TSOS {
	//manages running and terminating processes
    export class MemoryManager {

        memorySize : number;
        allocated : Pcb[];


        
        
        constructor() {
            this.memorySize=_Memory.memory.length;
            this.allocated= new Array();
       //     this.memorySize=_Memory.memory.size           
           
        }

        public  allocateMem(pid){
            var pcb= _ProcessManager.residentList[pid]
            //alert("allocate length is "+this.allocated.length)
                  
            else if (this.allocated.length==2){
                  pcb.baseRegister=512
                  pcb.limitRegister=767
                  this.allocated[2]=pcb
            }
            else if (this.allocated.length==1){
                  pcb.baseRegister=256
                   pcb.limitRegister=511
                   this.allocated[1]=pcb
            }
            else{
                pcb.baseRegister=0
                pcb.limitRegister=255
                this.allocated[0]=pcb

            }

            _ProcessManager.residentList[pid]=pcb;
                        
        }

        public deAllocateMem(pid){
            for (var i=0; i <this.allocated.length;i++){
               var curSeg= this.allocated[i]
                if(curSeg.Pid==pid){
                    _Memory.clearMemSeg(curSeg.baseRegister,curSeg.limitRegister);
                }


            }

        }
    }


}	