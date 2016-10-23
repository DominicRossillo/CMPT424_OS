///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatzflag, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

     module TSOS {

       export class Cpu {

         constructor(public PC: number = 0,
           public Acc: number = 0,
           public Xreg: number = 0,
           public Yreg: number = 0,
           public Zflag: number = 0,
           public isExecuting: boolean = false,
           public instruction: string = "00",
           public curPCB= null) {

         }

         public init(): void {
           this.PC = 0;
           this.Acc = 0;
           this.Xreg = 0;
           this.Yreg = 0;
           this.Zflag = 0;
           this.isExecuting = false;
         }
        //loads the values from the running pcb into the cpu
        public loadFromPcb(pcb){
          this.PC = pcb.PC
          this.Acc = pcb.Acc
          this.Xreg = pcb.Xreg
          this.Yreg = pcb.Yreg
          this.Zflag = pcb.Zflag
          this.curPCB=pcb
        }
        //updates the curpcb with values inside the cpu

        public updateCurPcb(){

          this.curPCB.updatePcb(this.PC,this.Acc,this.Xreg,this.Yreg,this.Zflag)


        }
        public cycle(): void {
          _Kernel.krnTrace('CPU cycle');
         
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //if the cpu is executing
            if(this.isExecuting){
                //set the current instruction to the value in memory at the PC
                this.instruction = ""+_Memory.memory[this.PC];
                
                switch (this.instruction) {
                            //load the accumulator with a constant
                            case "A9":     {    
                              this.PC++                      
                              this.Acc=parseInt(_Memory.memory[this.PC],16);                                             
                                   // alert("the cur Acc = "+this.Acc);
                                   
                                   this.PC++                  
                                   break;
                                 }
                            //load acc from memory
                            case "AD":{
                            //test string A9 01 A9 02 A9 1A A9 08 AD 05 00
                                  this.PC++
                                  //  var memloc="00"+_Memory.getFromMemory(this.PC)   
                                   //get the dec value of the pc in memory                                                  
                                   var decOfLoc= parseInt(_Memory.memory[this.PC],16);
                                
                                   this.PC++   
                                   //assign the new acc          
                                   alert(parseInt(_Memory.memory[decOfLoc],16))                 
                                   this.Acc=parseInt(_Memory.memory[decOfLoc],16)
                                                                                     
                                   // alert("the cur Acc = "+this.Acc);       
                                   this.PC++
                                   
                                   break;
                                 }
                                //store the acc value some where in memory
                                case "8D":{
                                  this.PC++
                                  var memloc="00"+_Memory.memory[this.PC];
                                  var memIndex= parseInt(memloc,16);                                                             
                                
                                 
                                  var newVal =(this.Acc).toString(16)  
                                   //if the new val is only one digit we ad a 0 to keep to the two hex format  
                                   if(newVal.length<=1){   
                                     newVal="0"+newVal;

                                   }
                                   _Memory.memory[memIndex]=newVal
                                  // _Memory.memoryUpdate(newVal,memIndex); 

                                   // alert("the Acc store location = "+_Memory.memory[memIndex]); 
                                   // alert(_Memory.memory);    
                                     this.PC++   
                                   this.PC++
                                   break;
                                 }
                                //Add with carry
                                case "6D":{
                                    this.PC++
                                    var memloc="00"+_Memory.memory[this.PC];    
                                    var decIndex= parseInt(memloc,16);                                               
                                    // alert("the cur Acc = "+this.Acc);     
                                    var decOfLoc= parseInt(_Memory.memory[decIndex],16)
                                    var awcResult= decOfLoc+this.Acc;
                                    this.PC++
                                    this.Acc=awcResult;
                                     
                                    
                                     // alert("the cur Acc = "+this.Acc);  
                                     this.PC++     
                                     break;
                                   }
                                //load x reg with constant 
                                case "A2":{
                                    this.PC++                     
                                    this.Xreg= parseInt(_Memory.memory[this.PC]);
                                     
                                
                                    // alert("the cur x Reg= "+this.Xreg); 
                                    this.PC++                 
                                    
                                    break;
                                  }
                                //load x reg from value in mem
                                case "AE":{
                                    this.PC++
                                    var memloc="00"+_Memory.memory[this.PC];                              
                                
                                
                                    var decOfLoc= _Memory.getFromMemory(memloc)
                                    this.PC++
                                
                                    this.Xreg=decOfLoc

                                   // alert("the cur X reg = "+this.Xreg);    
                                    this.PC++   
                                   
                                    break;
                                  }
                                //load y reg with value
                                case "A0":{
                                      this.PC++
                                      this.Yreg= parseInt(_Memory.memory[this.PC],16);
                                  
                                                                                     
                                     // alert("the cur y Reg= "+this.Yreg);                 
                                     this.PC++  
                                     
                                     break;
                                   }
                                //load y reg with value from memory
                                case "AC":{
                                      this.PC++
                                      var memloc="00"+_Memory.memory[this.PC]                                                                                                   
                                      var decOfLoc= _Memory.getFromMemory(memloc)
                                      
                                      this.Yreg=decOfLoc;
                                      this.PC++
                                       
                                      
                                         // alert("the cur y reg = "+this.Yreg);     
                                         this.PC++  
                                         
                                       break;
                                     }
                                //do nothing cause yea
                                case "EA":{
                                          this.PC++
                                          
                                          break;
                                        }
                                          //break syscall to signal that we finished the program 
                                case "00":
                                          {document.getElementById('pcbs_Status'+this.curPCB.Pid).innerText="false"
                                          this.updateCurPcb();
                                          
                                          _ProcessManager.terminateProcess();
                                          // this.curPCB=null;
                                          // this.PC = 0;
                                          // this.Acc = 0;
                                          // this.Xreg = 0; 
                                          // this.Yreg = 0;
                                          // this.Zflag = 0;
                                          // //display to user that we finished and reset the CPU for the next program
                                          // document.getElementById("zflag_field").innerText="0";

                                          // document.getElementById("pc_field").innerText="0";
                                          // document.getElementById("yreg_field").innerText="0"
                                          // document.getElementById("xreg_field").innerText="0"
                                          // document.getElementById("Acc_field").innerText="0" 

                                          if (_ProcessManager.readyQueue.getSize() == 0) {
                                            this.isExecuting = false;
                                          }
                                          _StdOut.putText("Finished running program.",true);
                                          _StdOut.advanceLine();
                                          
                                          _Memory.clearAllMemory();
                                          break;}
                                      //compare a byte in memory to x reg
                                case "EC":{
                                    this.PC++
                                    var memloc="00"+_Memory.memory[this.PC];                                                                                            
                                    var decOfLoc= _Memory.getFromMemory(memloc);
                                  //  alert("xreg value in EC="+this.Xreg)
                                  //  alert("location in mem value in EC= "+decOfLoc)
                                    if(this.Xreg==decOfLoc){
                                    //  alert("changing z flag to 1 at pc:"+this.PC)
                                      this.Zflag=1;
                                      
                                    }
                                    else{

                                     //  alert("changing z flag to 0 at pc:"+this.PC)
                                      this.Zflag=0;
                                      
                                    }
                                    this.PC++
                                        // alert("the cur Z flag = "+this.Zflag);
                                        this.PC++
                                        break;
                                      }

                                case "D0":{
                                      //jump pc
                                      this.PC++
                                    //  alert("dec of EF="+parseInt("EF",16));
                                    if (this.Zflag==0){
                                      var memVal=_Memory.memory[this.PC];  


                                      this.PC++ 
                                      var newPC=this.PC+parseInt(memVal,16);  

                                      if(newPC>255) {                           
                                        this.PC=newPC-256;
                                      }
                                      else{

                                        this.PC=newPC;
                                      }
                                    }
                                    else {
                                      this.PC++
                                    }
                                    break;
                                  }
                                      //increment a byte value at a address
                                case "EE":{
                                      this.PC++
                                      var memloc="00"+_Memory.memory[this.PC]                                                            
                                      
                                      var decOfLoc= _Memory.getFromMemory(memloc);
                                          // alert("the register value we are incrementing "+decOfLoc);     
                                          var newVal =(decOfLoc+1).toString(16);
                                          if (newVal.length<2){
                                            newVal="0"+newVal;
                                          }
                                          this.PC++
                                          _Memory.memoryUpdate(newVal,parseInt(memloc,16))
                                       // _Memory.memory[parseInt(memloc,16)]=(decOfLoc+1).toString(16);
                                       
                                       this.PC++           
                                            // alert("the register value we incremented "+_Memory.memory[parseInt(memloc,16)]);       
                                            break; 
                                          }
                                     //sys call to write to the clis
                               case "FF":{
                               
                                     if (this.Xreg==1){

                                       _StdOut.putText(""+(this.Yreg),true);
                                       _StdOut.advanceLine();
                                     }
                                     else if (this.Xreg==2){

                                       var tempPrint="";
                                       var printPointer=this.Yreg;
                                       while(_Memory.memory[printPointer]!="00"){
                                         var newLetter= this.hexToChar(_Memory.memory[printPointer])
                                         tempPrint+= ""+newLetter;
                                         printPointer++;
                                       }    

                                       _StdOut.putText(tempPrint,true)
                                       _StdOut.advanceLine();


                                     }
                                     this.PC++
                                     break;
                                   }
                            // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                            default:{
                            //if no cases are met me blue screan because of a bad input
                            _StdOut.putText("This is not a valid Op Code "+this.instruction,true);
                            _Kernel.krnTrapError("bad op code");
                            _Kernel.krnShutdown();
                            clearInterval(_hardwareClockID);
                            break;
                            }
                          }



                        }

                           this.updateCurPcb();


                      }


                      public hexToChar(hexLetter){
            var hex = hexLetter.toString();//force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
              str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
          }
        }
      }    