var TSOS;
(function (TSOS) {
    var pcb = (function () {
        function pcb(newPC, newAcc, newXreg, newYreg, newZflag, newExecuting) {
            this.PC = newPC;
            this.Acc = newAcc;
            this.Xreg = newXreg;
            this.Yreg = newYreg;
            this.Zflag = newZflag;
            this.isExecuting = newExecuting;
        }
        return pcb;
    }());
    TSOS.pcb = pcb;
})(TSOS || (TSOS = {}));
