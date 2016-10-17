var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager() {
            this.readyQueue = new TSOS.Queue();
            this.residentList = [];
        }
        ProcessManager.prototype.load = function () {
            var pcb = new TSOS.Pcb();
            pcb.Pid = allPcb.length + 1;
            this.residentList[pcb.Pid] = pcb;
            return pcb;
        };
        ProcessManager.prototype.runPid = function (pid) {
            var pcb = this.residentList[pid];
            this.readyQueue.enqueue(pcb);
            _CPU.isExecuting = true;
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
