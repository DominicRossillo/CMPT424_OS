var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(type, defaultquantum) {
            if (type === void 0) { type = "rr"; }
            if (defaultquantum === void 0) { defaultquantum = 3; }
            this.type = type;
            this.defaultquantum = defaultquantum;
            this.schType = type;
            this.quantum = defaultquantum;
            this.curQuan = 0;
        }
        Scheduler.prototype.callScheduler = function () {
            console.log("callScheduler");
            switch (this.schType) {
                case "rr": {
                    //_CPU.updateCurPcb()
                    //_ProcessManager.runningQueue.q[0]=_CPU.curPCB;
                    //if(this.curQuan>=this.quantum){
                    if (!_ProcessManager.readyQueue.isEmpty()) {
                        console.log("inside if of scheduler");
                        this.contextSwitch();
                    }
                    _CPU.isExecuting = true;
                    _CPU.updateCurPcb();
                    this.curQuan = 0;
                    break;
                }
                case "fcfs": {
                    if (!_ProcessManager.readyQueue.isEmpty()) {
                        console.log("inside if of scheduler");
                        this.contextSwitch();
                    }
                    _CPU.isExecuting = true;
                    _CPU.updateCurPcb();
                    this.curQuan = 0;
                    break;
                }
                case "priority": {
                    if (!_ProcessManager.readyQueue.isEmpty()) {
                        console.log("inside if of scheduler");
                        this.contextSwitch();
                    }
                    _CPU.isExecuting = true;
                    _CPU.updateCurPcb();
                    this.curQuan = 0;
                    break;
                }
            }
        };
        // context switch
        Scheduler.prototype.contextSwitch = function () {
            this.curQuan = 0;
            //	alert(_ProcessManager.readyQueue)
            if (this.schType != "priority") {
                document.getElementById('pcbs_Status' + _CPU.curPCB.Pid).innerText = "false";
                // console.log("contextSwitch")
                _CPU.updateCurPcb();
                _ProcessManager.runningQueue.q[0] = _CPU.curPCB;
                //dequeue the runningqueue
                var PCB = _ProcessManager.runningQueue.dequeue();
                // console.log(PCB)
                //enque the pcb we just removed from running onto ready
                //remove head of ready 
                var newPCB = _ProcessManager.readyQueue.dequeue();
                console.log(newPCB);
                //enqueue head of ready onto running
                if (newPCB.onDisk) {
                    _ProcessManager.readyQueue.enqueue(newPCB);
                    _ProcessManager.readyQueue.enqueue(PCB);
                    for (var i = 0; i < _ProcessManager.readyQueue.getSize() - 2; i++) {
                        _ProcessManager.readyQueue.enqueue(_ProcessManager.readyQueue.dequeue());
                    }
                    _ProcessManager.translateMemToDisk(PCB.Pid);
                    _MemoryManager.allocateMem(newPCB.Pid);
                    newPCB = _ProcessManager.readyQueue.dequeue();
                    _ProcessManager.readyQueue.dequeue();
                    _ProcessManager.runFromDisk(newPCB);
                    _ProcessManager.readyQueue.enqueue(PCB);
                }
                else {
                    _ProcessManager.readyQueue.enqueue(PCB);
                }
                _ProcessManager.runningQueue.enqueue(newPCB);
                _CPU.loadFromPcb(_ProcessManager.runningQueue.q[0]);
            }
            else {
                var lowestPriority = _ProcessManager.readyQueue.dequeue();
                var curCheckPcb;
                for (var i = 0; i < _ProcessManager.readyQueue.getSize(); i++) {
                    curCheckPcb = _ProcessManager.readyQueue.dequeue();
                    if (lowestPriority.priority > curCheckPcb.priority) {
                        _ProcessManager.readyQueue.enqueue(lowestPriority);
                        lowestPriority = curCheckPcb;
                    }
                    else if (lowestPriority.priority = curCheckPcb.priority && lowestPriority.waitTime < curCheckPcb.waitTime) {
                        _ProcessManager.readyQueue.enqueue(lowestPriority);
                        lowestPriority = curCheckPcb;
                    }
                    else {
                        _ProcessManager.readyQueue.enqueue(curCheckPcb);
                    }
                }
                if (lowestPriority.onDisk) {
                    for (var i = 0; i < _ProcessManager.readyQueue.getSize(); i++) {
                        var memToSwapOut = _ProcessManager.readyQueue.dequeue();
                        _ProcessManager.readyQueue.enqueue(memToSwapOut);
                    }
                    _ProcessManager.translateMemToDisk(memToSwapOut.Pid);
                }
                _ProcessManager.runningQueue.enqueue(lowestPriority);
            }
            //var newPCB=_ProcessManager.readyQueue.dequeue;
            //_ProcessManager.runningQueue.enqueue(newPCB);
        };
        Scheduler.prototype.updateScheduler = function (args) {
            if (args == "fcfs") {
                this.schType = args;
                _StdOut.putText("Scheduler has been updated to first come first serve.", true);
            }
            else if (args == "rr") {
                this.schType = args;
                _StdOut.putText("Scheduler has been updated to round robin.", true);
            }
            else if (args == "priority") {
                this.schType = args;
                _StdOut.putText("Scheduler has been updated to priority.", true);
            }
            else {
                _StdOut.putText("Usage: quantum <number> Please supply a quantum size.", true);
            }
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
