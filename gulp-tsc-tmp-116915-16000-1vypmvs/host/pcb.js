var TSOS;
(function (TSOS) {
    var Pcb = (function () {
        function Pcb(Pid, ProgramCount, PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (Pid === void 0) { Pid = 0; }
            if (ProgramCount === void 0) { ProgramCount = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.Pid = Pid;
            this.ProgramCount = ProgramCount;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
