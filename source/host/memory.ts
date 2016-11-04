
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
             this.memPoint=0;
             


         }

         public clearMemSeg(base,limit){
             for (var i=base ; i<=limit;i++){
                 _Memory.memory[i]="00";
                 document.getElementById("cell"+i).innerText="00";
                 
             }       


         }

         

         
     }
 }

