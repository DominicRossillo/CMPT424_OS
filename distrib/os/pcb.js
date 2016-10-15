var TSOS;
(function (TSOS) {
    var Pcb = (function () {
        function Pcb(newPC, newAcc, newXreg, newYreg, newZflag, newExecuting) {
            this.PC = newPC;
            this.Acc = newAcc;
            this.Xreg = newXreg;
            this.Yreg = newYreg;
            this.Zflag = newZflag;
            this.isExecuting = newExecuting;
        }
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
