
module TSOS {
    //memory of the host
    export class Memory {
        memory: string[];
        memPoint: number;

        
        constructor(){
            this.memPoint= 0;
            this.memory=[];
            for(var i =0; i<767; i++){
                
                this.memory.push("00");


            }

        }
         //function to update the memory and display it properly 
         public memoryUpdate(newValue,address){
             this.memory[address]=newValue;
             document.getElementById("cell"+address).innerText=newValue;
             this.memPoint++;

         }
         //function to get values from memory and convert them to dec
         public getFromMemory(index){
             var tarReg= parseInt(index,16);
             // alert("get from mem tarReg ="+tarReg)
             // alert("value at index = "+_Memory.memory[tarReg])
             return parseInt(this.memory[tarReg],16);
         }
         //function to set all values in mem to 00
         public clearAllMemory(){
             for (var i=0 ; i<this.memory.length;i++){
                 _Memory.memory[i]="00";
                 document.getElementById("cell"+i).innerText="00";
                 
             }
             _MemoryManager.allocated=[];
             _ProcessManager.readyQueue.q=[];
             _ProcessManager.runningQueue.q=[];
             _ProcessManager.residentList=[]
             
             this.memPoint=0;
             


         }
         //take a pcb anc clear the places in memory it is
         public clearMemSeg(pcb){
             alert("start clear")
             _MemoryManager.deAllocateMem(pcb.Pid);
             var clearStart= pcb.baseRegister;
             //loop through table and update values
             for (var i=clearStart ; i<pcb.limitRegister;i++){
                 _Memory.memory[i]="00";
                 document.getElementById("cell"+i).innerText="00";
                 
             }  
             
        }

         

         
     }
 }

