
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

         memoryUpdate(newValue:string){
             this.memory[this.memPoint]=newValue;
             this.memPoint++;
         }
         //function to get values from memory and convert them to dec
         getFromMemory(index){
             var tarReg= parseInt(index,16);
             // alert("get from mem tarReg ="+tarReg)
             // alert("value at index = "+this.memory[tarReg])
             return parseInt(this.memory[tarReg],16);
         }

    

    
    }


}