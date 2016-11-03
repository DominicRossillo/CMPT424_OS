module TSOS {
	//manages running and terminating processes
    export class MemoryManager {

        memorySize : number;
        allocated : Array<Pcb>;


        
        
        constructor() {
            this.memorySize=_Memory.memory.length;
            this.allocated=[];
       //     this.memorySize=_Memory.memory.size           
           
        }

        public allocateMem(pid){
            var pcb= _ProcessManager.residentList[pid]
            if (this.allocated.length>=3){
                  pcb.baseRegister=-1;    

            }           
            else if (this.allocated.length=2){
                  pcb.baseRegister=512
                  pcb.limitRegister=767
            }
            else if (this.allocated.length=1){
                  pcb.baseRegister=256
                   pcb.limitRegister=511
            }
            else{
                pcb.baseRegister=0
                pcb.limitRegister=255

            }
            
                        
        }
    }


}	