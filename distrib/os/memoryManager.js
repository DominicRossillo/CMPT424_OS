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
            console.log("allocateMem run");
            console.log("resident list length At start of allocate " + _ProcessManager.residentList.length);
            for (var i = 0; i < _ProcessManager.residentList.length; i++) {
                if (_ProcessManager.residentList[i].Pid == pid) {
                    var pcb = _ProcessManager.residentList[i];
                    break;
                }
            }
            // console.log(this.findFreeMem())
            var freeMem = this.findFreeMem();
            //alert(freeMem)
            //alert("allocate length is "+this.allocated.length)
            // console.log("find fre mem length "+this.findFreeMem.length)
            if (freeMem.length > 0) {
                var freebase = parseInt(freeMem[0]);
                //  alert("free base "+freebase);
                var freelimit = freebase + 255;
                //   alert("free limit "+freelimit);
                //      console.log("free base is" +freebase)
                pcb.baseRegister = freebase;
                pcb.limitRegister = freelimit;
                //      console.log("allocate baseReg is "+pcb.baseRegister)
                for (var i = 0; i < _ProcessManager.residentList.length; i++) {
                    if (_ProcessManager.residentList[i].Pid == pid) {
                        _ProcessManager.residentList[i] = pcb;
                        break;
                    }
                }
                this.allocated.push(pcb);
            }
            //      console.log("resident list After allocate mem everything" +this.residentList.length)
        };
        MemoryManager.prototype.deAllocateMem = function (pid) {
            console.log("deAllocate start length" + this.allocated.length);
            for (var i = 0; i < this.allocated.length; i++) {
                var curSeg = this.allocated[i];
                // console.log(" curSeg = "+curSeg)
                // console.log(" pid = "+pid)
                if (curSeg.Pid == pid) {
                    //console.log("deAlocated "+curSeg.baseRegister)
                    // console.log("dealocate index "+i)
                    this.allocated.splice(i, 1);
                    console.log("deallocateMem run");
                    console.log("deAllocate end length" + this.allocated.length);
                    break;
                }
            }
        };
        MemoryManager.prototype.findFreeMem = function () {
            var usedSegments = [];
            var allSegments = ["0", "256", "512"];
            var allfound = [];
            for (var i = 0; i < _ProcessManager.residentList.length && _ProcessManager.residentList.length > 0; i++) {
                //alert("residentList is this big:"+_ProcessManager.residentList.length)
                usedSegments.push(_ProcessManager.residentList[i].baseRegister);
            }
            for (var i = 0; i < _ProcessManager.readyQueue.getSize() && !_ProcessManager.readyQueue.isEmpty(); i++) {
                //  alert("ready queue is this big:"+_ProcessManager.readyQueue.getSize())
                usedSegments.push(_ProcessManager.readyQueue.q[i].baseRegister);
            }
            if (_ProcessManager.runningQueue.getSize() > 0) {
                usedSegments.push(_ProcessManager.runningQueue.q[0].baseRegister);
            }
            for (var i = 0; i < allSegments.length; i++) {
                var missingSeg = true;
                //  alert("usedSegments size"+ usedSegments.length)    
                for (var j = 0; j < usedSegments.length; j++) {
                    if (usedSegments[j] == allSegments[i]) {
                        missingSeg = false;
                        //  alert("found " +allSegments[i])
                        break;
                    }
                }
                if (missingSeg == true) {
                    allfound.push(allSegments[i]);
                }
            }
            alert("all found is " + allfound);
            return allfound;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
