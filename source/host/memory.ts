
module TSOS {
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
         public memoryUpdate(newValue,address){
             _Memory.memory[address]=newValue;
             document.getElementById("cell"+address).innerText=newValue;
             _Memory.memPoint++;

         }
         //function to get values from memory and convert them to dec
         public getFromMemory(index){
             var tarReg= parseInt(index,16);
             // alert("get from mem tarReg ="+tarReg)
             // alert("value at index = "+_Memory.memory[tarReg])
             return parseInt(_Memory.memory[tarReg],16);
         }
         public clearAllMemory(){
             for (var i=0 ; i<_Memory.memory.length;i++){
                 _Memory.memory[i]="00";
                 _Memory.memPoint=0;
             }

         


         }

    

    
    }
}

