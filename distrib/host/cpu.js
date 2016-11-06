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
            this.curPCB = pcb;
            this.isExecuting = true;
        };
        //updates the curpcb with values inside the cpu
        Cpu.prototype.updateCurPcb = function () {
            this.curPCB.updatePcb(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //if the cpu is executing
            if (this.isExecuting) {
                //set the current instruction to the value in memory at the PC
                var physicalAddress = this.findPhysicalAddress();
                this.instruction = "" + _Memory.memory[physicalAddress];
                switch (this.instruction) {
                    //load the accumulator with a constant
                    case "A9": {
                        this.PC++;
                        // alert("the cur Acc = "+this.Acc);
                        this.op_A9(_Memory.memory[this.findPhysicalAddress()]);
                        this.PC++;
                        break;
                    }
                    //load acc from memory
                    case "AD": {
                        //test string A9 01 A9 02 A9 1A A9 08 AD 05 00
                        this.PC++;
                        var memloc1 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        var memloc2 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        this.op_AD(memloc2 + memloc1);
                        break;
                    }
                    //store the acc value some where in memory
                    case "8D": {
                        this.PC++;
                        var memloc1 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        var memloc2 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.op_8D(memloc2 + memloc1);
                        this.PC++;
                        break;
                    }
                    //Add with carry
                    case "6D": {
                        this.PC++;
                        var memloc1 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        var memloc2 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        this.op_6D(memloc2 + memloc1);
                        break;
                    }
                    //load x reg with constant 
                    case "A2": {
                        this.PC++;
                        this.op_A2(_Memory.memory[this.findPhysicalAddress()]);
                        this.PC++;
                        break;
                    }
                    //load x reg from value in mem
                    case "AE": {
                        this.PC++;
                        var memloc1 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        var memloc2 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        this.op_AE(memloc2 + memloc1);
                        break;
                    }
                    //load y reg with value
                    case "A0": {
                        this.PC++;
                        this.op_A0(_Memory.memory[this.findPhysicalAddress()]);
                        this.PC++;
                        break;
                    }
                    //load y reg with value from memory
                    case "AC": {
                        this.PC++;
                        var memloc1 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        var memloc2 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        this.op_AC(memloc2 + memloc1);
                        break;
                    }
                    //do nothing cause yea
                    case "EA": {
                        this.PC++;
                        break;
                    }
                    //break syscall to signal that we finished the program 
                    case "00":
                        {
                            document.getElementById('pcbs_Status' + this.curPCB.Pid).innerText = "false";
                            this.updateCurPcb();
                            _ProcessManager.terminateProcess();
                            if (_ProcessManager.runningQueue.getSize() == 0) {
                                // alert("in if")
                                this.isExecuting = false;
                            }
                            _StdOut.putText("Finished running program.", true);
                            _StdOut.advanceLine();
                            break;
                        }
                    //compare a byte in memory to x reg
                    case "EC": {
                        this.PC++;
                        var memloc1 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        var memloc2 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        this.op_EC(memloc2 + memloc1);
                        //  alert("xreg value in EC="+this.Xreg)
                        //  alert("location in mem value in EC= "+decOfLoc)
                        break;
                    }
                    case "D0": {
                        //jump pc
                        this.PC++;
                        //  alert("dec of EF="+parseInt("EF",16));
                        this.op_D0(parseInt(_Memory.memory[this.findPhysicalAddress()], 16));
                        break;
                    }
                    //increment a byte value at a address
                    case "EE": {
                        this.PC++;
                        var memloc1 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        var memloc2 = "" + _Memory.memory[this.findPhysicalAddress()];
                        this.PC++;
                        this.op_EE(memloc2 + memloc1);
                        // alert("the register value we are incrementing "+decOfLoc);     
                        // _Memory.memory[parseInt(memloc,16)]=(decOfLoc+1).toString(16);
                        // alert("the register value we incremented "+_Memory.memory[parseInt(memloc,16)]);       
                        break;
                    }
                    //sys call to write to the clis
                    case "FF": {
                        this.op_FF();
                        this.PC++;
                        break;
                    }
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default: {
                        //if no cases are met me blue screan because of a bad input
                        _StdOut.putText("This is not a valid Op Code " + this.instruction, true);
                        _Kernel.krnTrapError("bad op code");
                        _Kernel.krnShutdown();
                        clearInterval(_hardwareClockID);
                        break;
                    }
                }
            }
            this.updateCurPcb();
        };
        Cpu.prototype.hexToChar = function (hexLetter) {
            var hex = hexLetter.toString(); //force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
        };
        Cpu.prototype.findPhysicalAddress = function () {
            return this.PC + this.curPCB.baseRegister;
        };
        Cpu.prototype.op_A9 = function (constent) {
            this.Acc = parseInt(constent, 16);
        };
        Cpu.prototype.op_AD = function (register) {
            var decRegister = parseInt(register, 16);
            this.Acc = parseInt(_Memory.memory[decRegister], 16);
        };
        Cpu.prototype.op_8D = function (tarRegister) {
            var decRegister = parseInt(tarRegister, 16) + this.curPCB.baseRegister;
            var newVal = (this.Acc).toString(16);
            if (newVal.length <= 1) {
                newVal = "0" + newVal;
            }
            _Memory.memory[decRegister] = newVal;
        };
        Cpu.prototype.op_6D = function (tarRegister) {
            var decRegister = parseInt(tarRegister, 16) + this.curPCB.baseRegister;
            this.Acc = this.Acc + parseInt(_Memory.memory[decRegister], 16);
        };
        Cpu.prototype.op_A2 = function (constent) {
            this.Xreg = parseInt(constent, 16);
        };
        Cpu.prototype.op_AE = function (tarRegister) {
            var decRegister = parseInt(tarRegister, 16) + this.curPCB.baseRegister;
            this.Xreg = parseInt(_Memory.memory[decRegister], 16);
        };
        Cpu.prototype.op_A0 = function (constent) {
            this.Yreg = parseInt(constent, 16);
        };
        Cpu.prototype.op_AC = function (tarRegister) {
            var decRegister = parseInt(tarRegister, 16) + this.curPCB.baseRegister;
            this.Yreg = parseInt(_Memory.memory[decRegister], 16);
        };
        Cpu.prototype.op_EC = function (tarRegister) {
            var decRegister = parseInt(tarRegister, 16) + this.curPCB.baseRegister;
            if (this.Xreg == parseInt(_Memory.memory[decRegister])) {
                //  alert("changing z flag to 1 at pc:"+this.PC)
                this.Zflag = 1;
            }
            else {
                this.Zflag = 0;
            }
        };
        Cpu.prototype.op_D0 = function (jumpSize) {
            if (this.Zflag == 0) {
                this.PC++;
                var newPC = this.PC + jumpSize;
                if (newPC > 255) {
                    this.PC = newPC - 256;
                }
                else {
                    this.PC = newPC;
                }
            }
            else {
                this.PC++;
            }
        };
        Cpu.prototype.op_EE = function (tarRegister) {
            var decRegister = parseInt(tarRegister, 16) + this.curPCB.baseRegister;
            var decOfLoc = _Memory.memory[decRegister];
            var newVal = (parseInt(decOfLoc, 16) + 1).toString(16);
            if (newVal.length < 2) {
                newVal = "0" + newVal;
            }
            _Memory.memoryUpdate(newVal, decRegister);
        };
        Cpu.prototype.op_FF = function () {
            if (this.Xreg == 1) {
                _StdOut.putText("" + (this.Yreg), true);
                _StdOut.advanceLine();
            }
            else if (this.Xreg == 2) {
                var tempPrint = "";
                var printPointer = this.Yreg + this.curPCB.baseRegister;
                while (_Memory.memory[printPointer] != "00") {
                    var newLetter = this.hexToChar(_Memory.memory[printPointer]);
                    tempPrint += "" + newLetter;
                    printPointer++;
                }
                _StdOut.putText(tempPrint, true);
                _StdOut.advanceLine();
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
