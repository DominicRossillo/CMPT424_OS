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
                    //if(this.curQuan>=this.quantum){
                    console.log("inside if of scheduler");
                    this.contextSwitch();
                    this.curQuan = 0;
                    break;
                }
                case "fcfs":
                    break;
            }
        };
        Scheduler.prototype.contextSwitch = function () {
            console.log("contextSwitch");
            var PCB = _ProcessManager.runningQueue.dequeue();
            console.log("running queue context switch" + _ProcessManager.runningQueue.getSize() + "readyqueue size is  " + _ProcessManager.readyQueue.getSize());
            if ((!_ProcessManager.readyQueue.isEmpty()) && _ProcessManager.runningQueue.isEmpty()) {
                console.log("newPCB being enqueued");
                var newPCB = _ProcessManager.readyQueue.dequeue;
                console.log(newPCB);
                _ProcessManager.runningQueue.enqueue(newPCB);
                _CPU.updateCurPcb();
            }
            //var newPCB=_ProcessManager.readyQueue.dequeue;
            //_ProcessManager.runningQueue.enqueue(newPCB);
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
