module TSOS {

    export class memoryManager {
    	public clearMemory() {
    		_Memory.clearAllMemory();

    	}
    	public memoryUpdate(newValue:string){
             _Memory.memory[_Memory.memPoint]=newValue;
             document.getElementById("cell"+_Memory.memPoint).innerText=newValue;
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