///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
          ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            //bsod
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- crashes the os.");
            this.commandList[this.commandList.length] = sc;
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            //whereami
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Tells you what your current location is.");
            this.commandList[this.commandList.length] = sc;
            //whatislove
            sc = new TSOS.ShellCommand(this.shellWhatislove, "whatislove", "- Tells you what love really is.");
            this.commandList[this.commandList.length] = sc;
            //date and time
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Tells you the current date and time.");
            this.commandList[this.commandList.length] = sc;
            //load hex file
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- checks to see if code in the taProgramInput is valid hex");
            this.commandList[this.commandList.length] = sc;
            //status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "- updates the current status, takes a string");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // run <PID>
            sc = new TSOS.ShellCommand(this.shellRun, "run", "- Runs a loaded program of a given <PID>.");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Runs all loaded programs.");
            this.commandList[this.commandList.length] = sc;
            // quantum <Int>
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- Change the quantum of the round robin schedual to a new <Int>.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- Clear all memory segments.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- List all running program IDs.");
            this.commandList[this.commandList.length] = sc;
            // kill <id> - kills the specified process id.
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "- Kill a program that is currently running.");
            this.commandList[this.commandList.length] = sc;
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ", true);
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],", true);
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].", true);
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.", true);
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.", true);
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.", true);
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.", true);
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.", true);
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?", true);
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION, true);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:", true);
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description, true);
            }
        };
        Shell.prototype.shellWhereami = function (args) {
            _StdOut.putText("You are infront of a computer, life is great.", true);
        };
        Shell.prototype.shellWhatislove = function (args) {
            if (_SarcasticMode) {
                _StdOut.putText("Alan of course, he is the master of all minions.", true);
            }
            else {
                _StdOut.putText("Dom is love, and life.", true);
            }
        };
        //bsod command
        Shell.prototype.shellBSOD = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
            var ctx = _Canvas.getContext("2d");
            //drawing blue square over cli
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, 500, 500);
            ctx.fill();
            _StdOut.putText("An error has occured, you broke something.");
            _Kernel.krnShutdown();
        };
        Shell.prototype.shellDate = function (args) {
            //prints the current date, time and time zone
            _StdOut.putText((Date().toString()), true);
            _StdOut.advanceLine();
        };
        //load function to test if code in the taprograminput is valid hex code
        Shell.prototype.shellLoad = function (args) {
            var re = /([^a-f^A-F^0-9^\s])+/g;
            var m;
            var testcode = document.getElementById("taProgramInput").value;
            var testpass = true;
            var memtable = document.getElementById('memoryTable');
            if (testcode.length > 0) {
                while ((m = re.exec(testcode)) !== null) {
                    if (m.index === re.lastIndex) {
                        re.lastIndex++;
                    }
                    else {
                        testpass = false;
                        break;
                    }
                }
            }
            else {
                testpass = false;
            }
            if (testpass) {
                if (_MemoryManager.allocated.length < 3) {
                    var curcode = 0;
                    var hexin = testcode.split(" ");
                    if (hexin.length < 256) {
                        var newPCB = _ProcessManager.load();
                        if (newPCB == null) {
                            return;
                        }
                        // alert("new base register for load"+newPCB.baseRegister);
                        _Memory.memPoint = newPCB.baseRegister;
                        for (var i = 0; i < Math.ceil((hexin.length / 8)); i++) {
                            for (var j = 1; (j <= hexin.length && j < 9 && curcode < hexin.length); j++) {
                                //memtable.rows[i].cells[j].innerHTML=hexin[curcode];
                                // newPC:number,newAcc:number,newXreg:number,newYreg:number,newZflag:number,newExecuting:boolean
                                //var newPcb = new Pcb(1,2,3,4,5,true);
                                //    console.log("mempoint is "+_Memory.memPoint);
                                _Memory.memoryUpdate(hexin[curcode], _Memory.memPoint);
                                //  memtable.innerHTML=hexin[curcode];
                                //alert(hexin[curcode]);
                                curcode++;
                            }
                        }
                        _StdOut.putText("This is valid hexcode", true);
                        _StdOut.advanceLine();
                        _StdOut.putText("The Program has been loaded with PID: " + newPCB.Pid, true);
                        _StdOut.advanceLine();
                        allPcb.push(newPCB);
                    }
                    else {
                        _StdOut.putText("This program is too large.", true);
                    }
                }
                else {
                    _StdOut.putText("Memory is already full.", true);
                }
            }
            else {
                _StdOut.putText("This is not valid hexcode", true);
            }
        };
        Shell.prototype.shellStatus = function (args) {
            //command to update status title outside of the cli
            if (args.length > 0) {
                var status = "";
                //loop that makes gets multiple word statuses 
                for (var i = 0; i < args.length; i++) {
                    status += args[i] + " ";
                }
                document.getElementById("status_title").innerText = status;
            }
            else {
                _StdOut.putText("Usage: status <word(s)>  Please supply a status.", true);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.", true);
                        break;
                    case "run":
                        _StdOut.putText("Runs all program loaded into memory.", true);
                        break;
                    case "runall":
                        _StdOut.putText("Runs a program loaded into memory referenced by a <PID>.", true);
                        break;
                    case "ver":
                        _StdOut.putText("Ver Displays the current version of the OS.", true);
                        break;
                    case "whereami":
                        _StdOut.putText("Where am i, helps you figure out where you are in real life.", true);
                        break;
                    case "date":
                        _StdOut.putText("Date can be used to find out the current Date and Time.", true);
                        break;
                    case "load":
                        _StdOut.putText("Checks the text in the text area is valid hex code.", true);
                        break;
                    case "status":
                        _StdOut.putText("Change the status title on the page.", true);
                        break;
                    case "whatislove":
                        _StdOut.putText("What is love is used to find what you really love.", true);
                        break;
                    case "bsod":
                        _StdOut.putText("Crashes the OS.", true);
                        break;
                    case "trace":
                        _StdOut.putText("Turns the OS trace on or off.", true);
                        break;
                    case "prompt":
                        _StdOut.putText("Set the prompt.", true);
                        break;
                    case "clearmem":
                        _StdOut.putText("Clear all memory segments", true);
                        break;
                    case "quantum":
                        _StdOut.putText("Change the quantum of the round robbin schedualer.", true);
                        break;
                    case "ps":
                        _StdOut.putText("List all running programs.", true);
                        break;
                    case "ps":
                        _StdOut.putText("Kill a program currently executing.", true);
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".", true);
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.", true);
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.", true);
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON", true);
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF", true);
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.", true);
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>", true);
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'", true);
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.", true);
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.", true);
            }
        };
        //comand to run programs
        Shell.prototype.shellRun = function (args) {
            if (args.length > 0) {
                var foundPID = false;
                for (var i = 0; i < _ProcessManager.residentList.length; i++) {
                    if (_ProcessManager.residentList[i].Pid == args) {
                        foundPID = true;
                        var tarPcb = _ProcessManager.residentList[i];
                        break;
                    }
                }
                //if the pid exists run it
                if (foundPID == true) {
                    _ProcessManager.runPid(args);
                }
                else
                    _StdOut.putText("The PID you entered is not valid.", true);
            }
            else {
                _StdOut.putText("Usage: status <run>  Please supply a pid.", true);
            }
        };
        //kill running program
        Shell.prototype.shellKill = function (args) {
            if (args.length > 0) {
                var foundPID = false;
                if (!_ProcessManager.readyQueue.isEmpty()) {
                    for (var i = 0; i < _ProcessManager.readyQueue.getSize(); i++) {
                        if (_ProcessManager.readyQueue.q[i].Pid == args) {
                            foundPID = true;
                            _ProcessManager.killReadyProcess(args);
                            break;
                        }
                    }
                }
                if (!_ProcessManager.runningQueue.isEmpty()) {
                    if (_ProcessManager.runningQueue.q[0].Pid == args) {
                        foundPID = true;
                        _ProcessManager.killRunningProcess(args);
                    }
                }
                //if the pid exists run it
                if (foundPID == false) {
                    _StdOut.putText("The PID you entered is not valid.", true);
                }
            }
            else {
                _StdOut.putText("Usage: status <kill>  Please supply a pid.", true);
            }
        };
        Shell.prototype.shellClearmem = function (args) {
            _Memory.clearAllMemory();
        };
        Shell.prototype.shellPs = function (args) {
            _StdOut.putText("Current running programs:", true);
            _StdOut.advanceLine();
            var currentPros = "";
            if (_ProcessManager.runningQueue.getSize() + _ProcessManager.readyQueue.getSize() > 0) {
                for (var i = 0; i < _ProcessManager.readyQueue.getSize(); i++) {
                    currentPros += " Pid " + _ProcessManager.readyQueue.q[i].Pid + " , ";
                }
                currentPros += "Pid " + _ProcessManager.runningQueue.q[0].Pid;
            }
            _StdOut.putText(currentPros, true);
        };
        Shell.prototype.shellRunAll = function (args) {
            if (_ProcessManager.residentList.length > 0) {
                for (var i = 0; i < _ProcessManager.residentList.length; i++) {
                    console.log("runall loop");
                    _ProcessManager.readyQueue.enqueue(_ProcessManager.residentList[i]);
                }
                _ProcessManager.residentList = [];
                _ProcessManager.runningQueue.enqueue(_ProcessManager.readyQueue.dequeue());
                // alert(this.runningQueue[0]);
                _CPU.loadFromPcb(_ProcessManager.runningQueue.q[0]);
            }
            else {
                _StdOut.putText("No programs are loaded to run.", true);
            }
        };
        Shell.prototype.shellQuantum = function (args) {
            //command to update status title outside of the cli
            if (args.length > 0) {
                var newquantum = null;
                if (args <= 0) {
                    _StdOut.putText("Quantum is required to be 1 or greater for Round Robbin", true);
                }
                else {
                    _StdOut.putText("Quantum has been changed to " + args, true);
                    _Scheduler.quantum = args;
                }
            }
            else {
                _StdOut.putText("Usage: quantum <number> Please supply a quantum size.", true);
            }
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
