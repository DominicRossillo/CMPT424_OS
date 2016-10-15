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
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        public runOpCode(args) {
            if (args.length > 0) {
                for (var i =this.PC ; i<args.length; i++){

                    var curOpCode = args[i];
                   // alert(curOpCode);
                    switch (curOpCode) {
                        //load the accumulator with a constant
                        case "A9":                               
                            this.Acc=parseInt(args[i+1],16);
                               i++;            
                               alert("the cur Acc = "+this.Acc);                   
                            break;
                        case "AD":
                        //test string A9 01 A9 02 A9 1A A9 08 AD 05 00
                               var memloc=""+args[i+2]+""+args[i+1]                                                      
                               var decOfLoc= _Memory.getFromMemory(memloc)                               
                               this.Acc=decOfLoc
                               i=i+2;            
                               alert("the cur Acc = "+this.Acc);       
                            
                            break;
                        case "8D":
                               var memloc=""+args[i+2]+""+args[i+1];
                               var memIndex= parseInt(memloc,16);                                                             
                               var decOfLoc= _Memory.getFromMemory(memloc);                               
                               _Memory.memory[memIndex]=this.Acc.toString(16);
                               i=i+2;            
                               alert("the Acc store location = "+_Memory.memory[memIndex]); 
                               alert(_Memory.memory);    
                            break;
                        case "6D":
                               var memloc=""+args[i+2]+""+args[i+1];                                                             
                                alert("the cur Acc = "+this.Acc);     
                               var decOfLoc= _Memory.getFromMemory(memloc);
                               var awcResult= decOfLoc+this.Acc;
                               this.Acc=awcResult;
                               i=i+2;            
                                 alert("the cur Acc = "+this.Acc);       
                            break;
                        case "A2":
                                                          
                            this.Xreg= parseInt(args[i+1],16);
                               i++;            
                               alert("the cur x Reg= "+this.Xreg);                   
                            
                            break;
                        case "AE":
                            var memloc=""+args[i+2]+""+args[i+1]
                              
                              
                              
                               var decOfLoc= _Memory.getFromMemory(memloc)
                               
                               this.Xreg=decOfLoc
                               i=i+2;            
                               alert("the cur X reg = "+this.Xreg);       
                            
                            break;
                         case "A0":
                                                          
                            this.Xreg= parseInt(args[i+1],16);
                               i++;            
                               alert("the cur x Reg= "+this.Xreg);                   
                            
                            break;
                        case "AC":
                            var memloc=""+args[i+2]+""+args[i+1]
                              
                              
                              
                               var decOfLoc= _Memory.getFromMemory(memloc)
                               
                               this.Xreg=decOfLoc
                               i=i+2;            
                               alert("the cur X reg = "+this.Xreg);       
                            
                            break;
                        case "EA":
                            _StdOut.putText("Turns the OS trace on or off.",true);
                            break;
                        case "00":
                            _StdOut.putText("Finished running program.",true);
                            break;
                        case "EC":
                            _StdOut.putText("Set the prompt.",true);
                            break;
                        case "D0":
                            _StdOut.putText("Set the prompt.",true);
                            break;
                        case "EE":
                            _StdOut.putText("Set the prompt.",true);
                            break;
                        case "FF":
                            _StdOut.putText("Set the prompt.",true);
                            break;
                        // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                        default:
                            _StdOut.putText("This is not a valid Op Code "+curOpCode,true);
                            break;
                    }
                } 
        }  
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.",true);
            }
        }

        



    }
}
