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
            console.log("resident LIST SIZE " + this.residentList.length);
            if (this.residentList.length < 3) {
                var pcb = new TSOS.Pcb();
                pcb.Pid = allPcb.length;
                this.residentList.push(pcb);
                for (var i = 0; i < this.residentList.length; i++) {
                    if (this.residentList[i].Pid == pcb.Pid) {
                        pcb = this.residentList[i];
                    }
                }
                // alert(this.residentList);
                _MemoryManager.allocateMem(pcb.Pid);
                document.getElementById('pcbTable').innerHTML += "<tr id=pidrow" + pcb.Pid + "> <td id='pcbs_PID" + pcb.Pid + "'>" + pcb.Pid + "</td> <td id='pcbs_Status" + pcb.Pid + "'>" + pcb.isExecuting + "</td> <td id='pcbs_PC" + pcb.Pid + "'>0</td></tr>";
                //  console.log("load pcb baseReg is "+pcb.baseRegister)
                return pcb;
            }
            else {
                _StdOut.putText("Memory is already full.", true);
                return null;
            }
        };
        //run a program by putting it into the readque and telling the cpu to run by setting it to executing
        ProcessManager.prototype.runPid = function (pid) {
            for (var i = 0; i < this.residentList.length; i++) {
                if (this.residentList[i].Pid == pid) {
                    var pcb = this.residentList[i];
                    break;
                }
            }
            // alert("before length"+this.residentList.length);
            //  console.log("resident list before" +this.residentList.length)
            //  alert("the pcb "+pcb);
            // alert("before ready queue "+this.readyQueue[0]);
            for (var i = 0; i < this.residentList.length; i++) {
                if (this.residentList[i].Pid == pid) {
                    console.log("splice");
                    this.residentList.splice(i, 1);
                    break;
                }
            }
            this.readyQueue.enqueue(pcb);
            //  console.log("resident list After everything" +this.residentList.length)
            // alert("after length"+this.residentList.length);
            // alert("ready queue "+this.readyQueue[0]);
            //var frontQueue=this.readyQueue.dequeue();
            if (this.runningQueue.isEmpty) {
                this.runningQueue.enqueue(this.readyQueue.dequeue());
                // alert(this.runningQueue[0]);
                _CPU.loadFromPcb(this.runningQueue.q[0]);
                console.log("resident list After Running" + this.residentList.length);
                document.getElementById('pcbs_Status' + _CPU.curPCB.Pid).innerText = "true";
            }
        };
        //stop the cpu from runnning once it runs out of things to run
        ProcessManager.prototype.terminateProcess = function () {
            // document.getElementById('pcbTable').innerHTML=""
            var newtable = "";
            for (var i = 0; i < this.readyQueue.getSize(); i++) {
                newtable += "<tr id=pidrow" + this.readyQueue.q[i].Pid + "> <td id='pcbs_PID" + this.readyQueue.q[i].Pid + "'>" + this.readyQueue.q[i].Pid + "</td> <td id='pcbs_Status" + this.readyQueue.q[i].Pid + "'>" + this.readyQueue.q[i].isExecuting + "</td> <td id='pcbs_PC" + this.readyQueue.q[i].Pid + "'>" + this.readyQueue.q[i].PC + "</td></tr>";
            }
            document.getElementById('pcbTable').innerHTML = newtable;
            _ProcessManager.runningQueue.q[0] = _CPU.curPCB;
            _Memory.clearMemSeg(_CPU.curPCB);
            //_CPU.isExecuting= false;
            _Scheduler.curQuan = _Scheduler.quantum;
            // console.log("running queue "+ this.runningQueue.getSize())
            var rempcb = this.runningQueue.dequeue();
            // console.log("running queue "+ this.runningQueue.getSize())
            this.finishedQueue.enqueue(rempcb);
            // console.log("resident list After Terminate" +this.residentList.length)
            // console.log("isExecuting "+_CPU.isExecuting)
            // console.log("running queue size"+ this.runningQueue.getSize())
            if (!this.readyQueue.isEmpty() && this.runningQueue.isEmpty()) {
                console.log("we enqueued after terminating");
                this.runningQueue.enqueue(this.readyQueue.dequeue());
                _CPU.loadFromPcb(this.runningQueue.q[0]);
            }
            else
                _CPU.isExecuting = false;
        };
        ProcessManager.prototype.killProcess = function (pid) {
            // document.getElementById('pcbTable').innerHTML=""
            var rempcb;
            if (this.runningQueue.q[0].Pid == pid) {
                rempcb = this.runningQueue.dequeue();
            }
            else {
                for (var i = 0; i < this.readyQueue.getSize(); i++) {
                    if (this.readyQueue.q[i].Pid != pid) {
                        this.readyQueue.enqueue(this.readyQueue.dequeue());
                    }
                    else {
                        rempcb = this.readyQueue.dequeue();
                    }
                }
            }
            var newtable = "";
            for (var i = 0; i < this.readyQueue.getSize(); i++) {
                newtable += "<tr id=pidrow" + this.readyQueue.q[i].Pid + "> <td id='pcbs_PID" + this.readyQueue.q[i].Pid + "'>" + this.readyQueue.q[i].Pid + "</td> <td id='pcbs_Status" + this.readyQueue.q[i].Pid + "'>" + this.readyQueue.q[i].isExecuting + "</td> <td id='pcbs_PC" + this.readyQueue.q[i].Pid + "'>" + this.readyQueue.q[i].PC + "</td></tr>";
            }
            if (!this.runningQueue.isEmpty()) {
                newtable += "<tr id=pidrow" + this.runningQueue.q[0].Pid + "> <td id='pcbs_PID" + this.runningQueue.q[0].Pid + "'>" + this.runningQueue.q[0].Pid + "</td> <td id='pcbs_Status" + this.runningQueue.q[0].Pid + "'>" + this.runningQueue.q[0].isExecuting + "</td> <td id='pcbs_PC" + this.runningQueue.q[0].Pid + "'>" + this.runningQueue.q[0].PC + "</td></tr>";
            }
            document.getElementById('pcbTable').innerHTML = newtable;
            _Memory.clearMemSeg(rempcb);
            //_CPU.isExecuting= false;
            this.finishedQueue.enqueue(rempcb);
            _StdOut.putText("PID " + rempcb.Pid + " has been terminated.", true);
            _StdOut.advancedLine();
            _Scheduler.curQuan = 0;
            if (!this.readyQueue.isEmpty() && this.runningQueue.isEmpty()) {
                this.runningQueue.enqueue(this.readyQueue.dequeue());
                _CPU.loadFromPcb(this.runningQueue.q[0]);
            }
            else
                _CPU.isExecuting = false;
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
