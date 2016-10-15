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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        Cpu.prototype.runOpCode = function (args) {
            if (args.length > 0) {
                for (var i = 0; i < args.length; i++) {
                    var curOpCode = args[i];
                    alert(curOpCode);
                    switch (curOpCode) {
                        //load the accumulator with a constant
                        case "A9":
                            this.Acc = args[i + 1];
                            i = i + 2;
                            break;
                        case "AD":
                            _StdOut.putText("Ver Displays the current version of the OS.", true);
                            break;
                        case "8D":
                            _StdOut.putText("Where am i, helps you figure out where you are in real life.", true);
                            break;
                        case "6D":
                            _StdOut.putText("Date can be used to find out the current Date and Time.", true);
                            break;
                        case "A2":
                            _StdOut.putText("Checks the text in the text area is valid hex code.", true);
                            break;
                        case "AE":
                            _StdOut.putText("Change the status title on the page.", true);
                            break;
                        case "A0":
                            _StdOut.putText("What is love is used to find what you really love.", true);
                            break;
                        case "AC":
                            _StdOut.putText("Crashes the OS.", true);
                            break;
                        case "EA":
                            _StdOut.putText("Turns the OS trace on or off.", true);
                            break;
                        case "00":
                            _StdOut.putText("Set the prompt.", true);
                            break;
                        case "EC":
                            _StdOut.putText("Set the prompt.", true);
                            break;
                        case "D0":
                            _StdOut.putText("Set the prompt.", true);
                            break;
                        case "EE":
                            _StdOut.putText("Set the prompt.", true);
                            break;
                        case "FF":
                            _StdOut.putText("Set the prompt.", true);
                            break;
                        // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                        default:
                            _StdOut.putText("This is not a valid Op Code " + curOpCode, true);
                    }
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.", true);
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
