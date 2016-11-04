var TSOS;
(function (TSOS) {
    //manages running and terminating processes
    var ProcessManager = (function () {
        function ProcessManager() {
            this.readyQueue = new TSOS.Queue();
            this.runningQueue = new TSOS.Queue();
            this.finishedQueue = new TSOS.Queue();
            this.residentList = [];
        }
        //load a pcb into resident que 
        ProcessManager.prototype.load = function () {
            //alert(_MemoryManager.allocated.length)
            var pcb = new TSOS.Pcb();
            pcb.Pid = this.residentList.length;
            this.residentList[pcb.Pid] = pcb;
            alert(this.residentList);
            _MemoryManager.allocateMem(pcb.Pid);
            document.getElementById('pcbTable').innerHTML += "<tr> <td id='pcbs_PID" + pcb.Pid + "'>" + pcb.Pid + "</td> <td id='pcbs_Status" + pcb.Pid + "'>" + pcb.isExecuting + "</td> <td id='pcbs_PC" + pcb.Pid + "'>0</td></tr>";
            return this.residentList[pcb.Pid];
        };
        //run a program by putting it into the readque and telling the cpu to run by setting it to executing
        ProcessManager.prototype.runPid = function (pid) {
            var pcb = this.residentList[pid];
            this.residentList.splice(pid, 1);
            this.readyQueue.enqueue(pcb);
            _CPU.curPCB = pcb;
            pcb.isExecuting = true;
            _CPU.loadFromPcb(pcb);
            document.getElementById('pcbs_Status' + pid).innerText = "" + pcb.isExecuting;
        };
        //stop the cpu from runnning once it runs out of things to run
        ProcessManager.prototype.terminateProcess = function () {
            _CPU.isExecuting = false;
            var rempcb = this.runningQueue.dequeue;
            this.finishedQueue.enqueue(rempcb);
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
