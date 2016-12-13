var TSOS;
(function (TSOS) {
    //pcb object
    var Pcb = (function () {
        function Pcb(Pid, PC, Acc, Xreg, Yreg, Zflag, isExecuting, baseRegister, limitRegister, waitTime, turnAroundTime, priority) {
            if (Pid === void 0) { Pid = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (baseRegister === void 0) { baseRegister = -1; }
            if (limitRegister === void 0) { limitRegister = -1; }
            if (waitTime === void 0) { waitTime = 0; }
            if (turnAroundTime === void 0) { turnAroundTime = 0; }
            if (priority === void 0) { priority = 0; }
            this.Pid = Pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.baseRegister = baseRegister;
            this.limitRegister = limitRegister;
            this.waitTime = waitTime;
            this.turnAroundTime = turnAroundTime;
            this.priority = priority;
        }
        //funciton to update your current pcb with new values taken from the cpu
        Pcb.prototype.updatePcb = function (newPC, newAcc, newXreg, newYreg, newZflag) {
            _CPU.curPCB.PC = newPC;
            _CPU.curPCB.Acc = newAcc;
            _CPU.curPCB.Xreg = newXreg;
            _CPU.curPCB.Yreg = newYreg;
            _CPU.curPCB.Zflag = newZflag;
        };
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));