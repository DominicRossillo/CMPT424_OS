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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, instruction, curPCB) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (instruction === void 0) { instruction = "00"; }
            if (curPCB === void 0) { curPCB = null; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.instruction = instruction;
            this.curPCB = curPCB;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        //loads the values from the running pcb into the cpu
        Cpu.prototype.loadFromPcb = function (pcb) {
            this.PC = pcb.PC;
            this.Acc = pcb.Acc;
            this.Xreg = pcb.Xreg;
            this.Yreg = pcb.Yreg;
            this.Zflag = pcb.Zflag;
        };
        //updates the curpcb with values inside the cpu
        Cpu.prototype.updateCurPcb = function () {
            if (this.curPCB != null) {
                this.curPCB.updatePcb(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
            }
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.isExecuting) {
                this.instruction = "" + _Memory.memory[this.PC];
                document.getElementById("instr_field").innerText = this.instruction;
                switch (this.instruction) {
                    //load the accumulator with a constant
                    case "A9":
                        this.PC++;
                        this.Acc = parseInt(_Memory.memory[this.PC], 16);
                        // alert("the cur Acc = "+this.Acc);
                        document.getElementById("Acc_field").innerText = "" + this.Acc;
                        this.PC++;
                        break;
                    case "AD":
                        //test string A9 01 A9 02 A9 1A A9 08 AD 05 00
                        this.PC++;
                        var memloc = "00" + _Memory.getFromMemory(this.PC);
                        var decOfLoc = _Memory.getFromMemory(memloc);
                        this.PC++;
                        this.Acc = decOfLoc;
                        document.getElementById("Acc_field").innerText = "" + this.Acc;
                        // alert("the cur Acc = "+this.Acc);       
                        this.PC++;
                        break;
                    case "8D":
                        this.PC++;
                        var memloc = "00" + _Memory.memory[this.PC];
                        var memIndex = parseInt(memloc, 16);
                        var decOfLoc = _Memory.getFromMemory(memloc);
                        this.PC++;
                        _Memory.memory[memIndex] = this.Acc.toString(16);
                        // alert("the Acc store location = "+_Memory.memory[memIndex]); 
                        // alert(_Memory.memory);    
                        this.PC++;
                        break;
                    case "6D":
                        this.PC++;
                        var memloc = "00" + _Memory.memory[this.PC];
                        // alert("the cur Acc = "+this.Acc);     
                        var decOfLoc = _Memory.getFromMemory(memloc);
                        var awcResult = decOfLoc + this.Acc;
                        this.PC++;
                        this.Acc = awcResult;
                        document.getElementById("Acc_field").innerText = "" + this.Acc;
                        // alert("the cur Acc = "+this.Acc);  
                        this.PC++;
                        break;
                    case "A2":
                        this.PC++;
                        this.Xreg = parseInt(_Memory.memory[this.PC]);
                        document.getElementById("xreg_field").innerText = "" + this.Xreg;
                        // alert("the cur x Reg= "+this.Xreg); 
                        this.PC++;
                        break;
                    case "AE":
                        this.PC++;
                        var memloc = "00" + _Memory.memory[this.PC];
                        var decOfLoc = _Memory.getFromMemory(memloc);
                        this.PC++;
                        this.Xreg = decOfLoc;
                        document.getElementById("xreg_field").innerText = "" + this.Xreg;
                        // alert("the cur X reg = "+this.Xreg);    
                        this.PC++;
                        break;
                    case "A0":
                        this.PC++;
                        this.Yreg = parseInt(_Memory.memory[this.PC], 16);
                        this.PC++;
                        document.getElementById("yreg_field").innerText = "" + this.Yreg;
                        // alert("the cur y Reg= "+this.Yreg);                 
                        this.PC++;
                        break;
                    case "AC":
                        this.PC++;
                        var memloc = "00" + _Memory.memory[this.PC];
                        var decOfLoc = _Memory.getFromMemory(memloc);
                        this.Yreg = decOfLoc;
                        this.PC++;
                        document.getElementById("yreg_field").innerText = "" + this.Yreg;
                        // alert("the cur y reg = "+this.Yreg);     
                        this.PC++;
                        break;
                    case "00":
                        this.updateCurPcb();
                        _ProcessManager.terminateProcess();
                        this.curPCB = null;
                        this.PC = 0;
                        this.Acc = 0;
                        this.Xreg = 0;
                        this.Yreg = 0;
                        this.Zflag = 0;
                        if (_ProcessManager.readyQueue.getSize() == 0) {
                            this.isExecuting = false;
                        }
                        _StdOut.putText("Finished running program.", true);
                        break;
                    case "EC":
                        this.PC++;
                        var memloc = "00" + _Memory.memory[this.PC];
                        var decOfLoc = _Memory.getFromMemory(memloc);
                        if (this.Xreg == decOfLoc) {
                            this.Zflag = 1;
                            document.getElementById("zflag_field").innerText = "" + this.Zflag;
                        }
                        this.PC;
                        // alert("the cur Z flag = "+this.Zflag);
                        this.PC;
                        break;
                    case "D0":
                        //jump pc
                        this.PC++;
                        var jumpSize = _Memory.getFromMemory(this.PC);
                        this.PC = this.PC + jumpSize;
                        _StdOut.putText("Set the prompt.", true);
                        break;
                    case "EE":
                        this.PC++;
                        var memloc = "00" + _Memory.memory[this.PC];
                        var decOfLoc = _Memory.getFromMemory(memloc);
                        // alert("the register value we are incrementing "+decOfLoc);     
                        var awcResult = decOfLoc + this.Acc;
                        _Memory.memory[parseInt(memloc, 16)] = (decOfLoc + 1).toString(16);
                        this.PC++;
                        // alert("the register value we incremented "+_Memory.memory[parseInt(memloc,16)]);       
                        break;
                    case "FF":
                        this.PC++;
                        if (this.Xreg == 1) {
                            _StdOut.putText(this.Yreg.toString, true);
                        }
                        else if (this.Xreg == 2) {
                            var yPrintVal = _Memory.memory[this.Yreg];
                            _StdOut.putText(yPrintVal, true);
                        }
                        _StdOut.putText("Set the prompt.", true);
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("This is not a valid Op Code " + this.instruction, true);
                        break;
                }
            }
            //     public runOpCode(args) {
            //         if (args.length > 0) {
            //             for (var i =this.PC ; i<args.length; i++){
            //                 document.getElementById("pc_field").innerText=""+i;  
            //                 var curOpCode = args[i];
            //                 document.getElementById("pc_field").innerText=curOpCode;
            //                // alert(curOpCode);
            //                 switch (curOpCode) {
            //                     //load the accumulator with a constant
            //                     case "A9":                               
            //                         this.Acc=parseInt(args[i+1],16);
            //                            i++;            
            //                            alert("the cur Acc = "+this.Acc);
            //                            document.getElementById("Acc_field").innerText=""+this.Acc;                   
            //                         break;
            //                     case "AD":
            //                     //test string A9 01 A9 02 A9 1A A9 08 AD 05 00
            //                            var memloc=""+args[i+2]+""+args[i+1]                                                      
            //                            var decOfLoc= _Memory.getFromMemory(memloc)                               
            //                            this.Acc=decOfLoc;
            //                            document.getElementById("Acc_field").innerText=""+this.Acc;    
            //                            i=i+2;            
            //                            alert("the cur Acc = "+this.Acc);       
            //                         break;
            //                     case "8D":
            //                            var memloc=""+args[i+2]+""+args[i+1];
            //                            var memIndex= parseInt(memloc,16);                                                             
            //                            var decOfLoc= _Memory.getFromMemory(memloc);                               
            //                            _Memory.memory[memIndex]=this.Acc.toString(16);
            //                            i=i+2;            
            //                            alert("the Acc store location = "+_Memory.memory[memIndex]); 
            //                            alert(_Memory.memory);    
            //                         break;
            //                     case "6D":
            //                            var memloc=""+args[i+2]+""+args[i+1];                                                             
            //                             alert("the cur Acc = "+this.Acc);     
            //                            var decOfLoc= _Memory.getFromMemory(memloc);
            //                            var awcResult= decOfLoc+this.Acc;
            //                            this.Acc=awcResult;
            //                            document.getElementById("Acc_field").innerText=""+this.Acc;    
            //                            i=i+2;            
            //                              alert("the cur Acc = "+this.Acc);       
            //                         break;
            //                     case "A2":
            //                         this.Xreg= parseInt(args[i+1],16);
            //                         document.getElementById("xreg_field").innerText=""+this.Xreg;    
            //                            i++;            
            //                            alert("the cur x Reg= "+this.Xreg);                   
            //                         break;
            //                     case "AE":
            //                         var memloc=""+args[i+2]+""+args[i+1]
            //                            var decOfLoc= _Memory.getFromMemory(memloc)
            //                            this.Xreg=decOfLoc
            //                            document.getElementById("xreg_field").innerText=""+this.Xreg;    
            //                            i=i+2;            
            //                            alert("the cur X reg = "+this.Xreg);       
            //                         break;
            //                      case "A0":
            //                         this.Xreg= parseInt(args[i+1],16);
            //                         document.getElementById("yreg_field").innerText=""+this.Yreg;    
            //                            i++;            
            //                            alert("the cur y Reg= "+this.Yreg);                   
            //                         break;
            //                     case "AC":
            //                         var memloc=""+args[i+2]+""+args[i+1]
            //                            var decOfLoc= _Memory.getFromMemory(memloc)
            //                            this.Yreg=decOfLoc;
            //                            document.getElementById("yreg_field").innerText=""+this.Yreg;    
            //                            i=i+2;            
            //                            alert("the cur y reg = "+this.Yreg);       
            //                         break;
            //                     case "00":
            //                         i=args.length;
            //                         _StdOut.putText("Finished running program.",true);
            //                         break;
            //                     case "EC":
            //                         var memloc=""+args[i+2]+""+args[i+1];                                                                                            
            //                                var decOfLoc= _Memory.getFromMemory(memloc);
            //                                if(this.Xreg==decOfLoc){
            //                                    this.Zflag=1;
            //                                    document.getElementById("zflag_field").innerText=""+this.Zflag;  
            //                                }
            //                                i=i+2;  
            //                         alert("the cur Z flag = "+this.Zflag);   
            //                         break;
            //                     case "D0":
            //                         //jump pc
            //                         var jumpSize=parseInt(args[i+1]);
            //                         i=i+jumpSize
            //                         _StdOut.putText("Set the prompt.",true);
            //                         break;
            //                     case "EE":
            //                          var memloc=""+args[i+2]+""+args[i+1];                                                             
            //                            var decOfLoc= _Memory.getFromMemory(memloc);
            //                             alert("the register value we are incrementing "+decOfLoc);     
            //                            var awcResult= decOfLoc+this.Acc;
            //                            _Memory.memory[parseInt(memloc,16)]=(decOfLoc+1).toString(16);
            //                            i=i+2;            
            //                               alert("the register value we incremented "+_Memory.memory[parseInt(memloc,16)]);       
            //                         break; 
            //                     case "FF":
            //                         if (this.Xreg==1){
            //                            _StdOut.putText(this.Yreg.toString,true);
            //                         }
            //                         else if (this.Xreg==2){
            //                             var yPrintVal=_Memory.memory[this.Yreg];
            //                             _StdOut.putText(yPrintVal,true)
            //                         }
            //                         _StdOut.putText("Set the prompt.",true);    
            //                         break;
            //                     // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
            //                     default:
            //                         _StdOut.putText("This is not a valid Op Code "+curOpCode,true);
            //                         break;
            //                 }
            //             } 
            //     }  
            //         else {
            //             _StdOut.putText("Usage: man <topic>  Please supply a topic.",true);
            //         }
            //     }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
