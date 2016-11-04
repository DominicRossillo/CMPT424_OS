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
            var freeMem = this.findFreeMem();
            //alert("allocate length is "+this.allocated.length)
            if (freeMem.length > 0) {
                var freebase = parseInt(freeMem[0]);
                var freelimit = freebase + 255;
                pcb.baseRegister = freebase;
                pcb.limitRegister = freelimit;
                _ProcessManager.residentList[pid] = pcb;
            }
            // if (this.allocated.length==2){
            //       pcb.baseRegister=512
            //       pcb.limitRegister=767
            //       this.allocated[2]=pcb
            // }
            // else if (this.allocated.length==1){
            //       pcb.baseRegister=256
            //        pcb.limitRegister=511
            //        this.allocated[1]=pcb
            // }
            // else{
            //     pcb.baseRegister=0
            //     pcb.limitRegister=255
            //     this.allocated[0]=pcb
            // }
        };
        MemoryManager.prototype.deAllocateMem = function (pid) {
            for (var i = 0; i < this.allocated.length; i++) {
                var curSeg = this.allocated[i];
                if (curSeg.Pid == pid) {
                    this.allocated[i].Pid = -1;
                }
                break;
            }
            _Memory.clearMemSeg(curSeg);
        };
        MemoryManager.prototype.findFreeMem = function () {
            var usedSegments = [];
            var allSegments = ["0", "256", "512"];
            var allfound = [];
            for (var i = 0; i < _ProcessManager.readyQueue.getSize(); i++) {
                usedSegments.push(_ProcessManager.readyQueue[i].baseRegister);
            }
            if (_CPU.isExecuting) {
                usedSegments.push(_ProcessManager.runningQueue[0].baseRegister);
            }
            for (var i = 0; i < allSegments.length; i++) {
                var missingSeg = false;
                for (var j = 0; j < usedSegments.length; j++) {
                    if (usedSegments[j] == allSegments[i]) {
                        missingSeg = false;
                        break;
                    }
                    else {
                        missingSeg = true;
                    }
                }
                if (missingSeg = true) {
                    allfound.push(allSegments[i]);
                }
            }
            return allfound;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
