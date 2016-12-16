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
                    alert("found");
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
                var freelimit = freebase + 255;
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
        //deallocate memory that is assigned to a pid
        MemoryManager.prototype.deAllocateMem = function (pid) {
            // console.log("deAllocate start length"+this.allocated.length)
            for (var i = 0; i < this.allocated.length; i++) {
                var curSeg = this.allocated[i];
                if (curSeg.Pid == pid) {
                    this.allocated.splice(i, 1);
                    break;
                }
            }
        };
        //function to find where and memory we have open space
        MemoryManager.prototype.findFreeMem = function () {
            var usedSegments = [];
            var allSegments = ["0", "256", "512"];
            var allfound = [];
            //these for loops allow us to add all the elements in the resident queue and ready queue and the running queue and add it to a list
            for (var i = 0; i < _ProcessManager.residentList.length && _ProcessManager.residentList.length > 0; i++) {
                if (!_ProcessManager.residentList[i].onDisk) {
                    usedSegments.push(_ProcessManager.residentList[i].baseRegister);
                }
            }
            for (var i = 0; i < _ProcessManager.readyQueue.getSize() && !_ProcessManager.readyQueue.isEmpty(); i++) {
                if (!_ProcessManager.readyQueue.q[i].onDisk) {
                    usedSegments.push(_ProcessManager.readyQueue.q[i].baseRegister);
                }
            }
            if (_ProcessManager.runningQueue.getSize() > 0) {
                usedSegments.push(_ProcessManager.runningQueue.q[0].baseRegister);
            }
            //we loop through this list and check all the sectors values and see if one doesnt show up.
            for (var i = 0; i < allSegments.length; i++) {
                var missingSeg = true;
                //  alert("usedSegments size"+ usedSegments.length)    
                for (var j = 0; j < usedSegments.length; j++) {
                    if (usedSegments[j] == allSegments[i]) {
                        missingSeg = false;
                        break;
                    }
                }
                //if something is found add it to all found list 
                if (missingSeg == true) {
                    allfound.push(allSegments[i]);
                }
            }
            //return the free sector to be used as a base register for a loaded PCB
            return allfound;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
