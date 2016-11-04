var TSOS;
(function (TSOS) {
    //manages running and terminating processes
    var MemoryManager = (function () {
        function MemoryManager() {
            this.memorySize = _Memory.memory.length;
            this.allocated = new Array();
            //     this.memorySize=_Memory.memory.size           
        }
        MemoryManager.prototype.allocateMem = function (pid) {
            var pcb = _ProcessManager.residentList[pid];
            if (this.allocated.length == 2) {
                pcb.baseRegister = 512;
                pcb.limitRegister = 767;
                this.allocated[2] = pcb;
            }
            else if (this.allocated.length == 1) {
                pcb.baseRegister = 256;
                pcb.limitRegister = 511;
                this.allocated[1] = pcb;
            }
            else {
                pcb.baseRegister = 0;
                pcb.limitRegister = 255;
                this.allocated[0] = pcb;
            }
            _ProcessManager.residentList[pid] = pcb;
        };
        MemoryManager.prototype.deAllocateMem = function (pid) {
            for (var i = 0; i < this.allocated.length; i++) {
                var curSeg = this.allocated[i];
                if (curSeg.Pid == pid) {
                    _Memory.clearMemSeg(curSeg.baseRegister, curSeg.limitRegister);
                }
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
