///<reference path="../globals.ts" />
///<reference path="queue.ts" />

/* ------------
     Kernel.ts

     Requires globals.ts
              queue.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

     module TSOS {

         export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {      // Page 8. {
            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.

            // Initialize the console.
            _Console = new Console();          // The command line interface / console I/O device.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //initialize memory
            _Memory= new Memory();
            _ProcessManager= new ProcessManager();
             _MemoryManager= new MemoryManager();
             _Scheduler= new Scheduler();
          //  _MemoryManager= new MemoryManager();
            //
            // ... more?
            //

            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        }


        public krnOnCPUClockPulse() {
             document.getElementById("Acc_field").innerText=""+_CPU.Acc; 
             document.getElementById("yreg_field").innerText=""+_CPU.Yreg; 
             document.getElementById("xreg_field").innerText=""+_CPU.Xreg; 
             document.getElementById("zflag_field").innerText=""+_CPU.Zflag;    
             document.getElementById("pc_field").innerText=""+_CPU.PC;
             document.getElementById("instr_field").innerText=_CPU.instruction;
              if (_CPU.curPCB !=null){
                  document.getElementById("pc_field").innerText=""+_CPU.PC+"("+(_CPU.curPCB.baseRegister+_CPU.PC)+")";
              }
              //if there are items in the readyqueue increment each of their turnaround time and wait time
              if(_ProcessManager.readyQueue.getSize()>0){
                  for(var i=0;i<_ProcessManager.readyQueue.getSize();i++){
                      _ProcessManager.readyQueue.q[i].turnAroundTime++;
                      _ProcessManager.readyQueue.q[i].waitTime++;
                  }
              }
              //ifsomething is in the running queue incrememnt its turnaround time
              if(_ProcessManager.runningQueue.getSize()>0){
                  _ProcessManager.runningQueue.q[0].turnAroundTime++;
              }



            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.                           */
               var curentTime=Date().toString()
               document.getElementById("time_title").innerText=Date();

            // Check for an interrupt, are any. Page 560
           // console.log("size of running queue on clock pulse"+_ProcessManager.runningQueue.getSize())
            // console.log("running queue size="+_ProcessManager.runningQueue.getSize()+" and isExecuting ="+_CPU.isExecuting)
            // console.log("curQuan is "+ _Scheduler.curQuan)
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } 
            //if the running queue has something in it but the cpu isnt executing || if the cpu is executing and the curQuantum from the scheduler is max 
            else if((_ProcessManager.runningQueue.getSize()>0 && !(_CPU.isExecuting))||((_CPU.isExecuting)&&_Scheduler.curQuan==_Scheduler.quantum)){
                  //console.log("in context switch clock pulse")
                  //call the scheduler to do context switches 
                  _Scheduler.callScheduler()
                  this.krnTrace("Context_Switch");
                 // _CPU.isExecuting=true;

              
                

            }



            else if (_CPU.isExecuting) {

                  // If there are no interrupts then run one CPU cycle if there is anything being processed. {
                //if step mode is toggled and we are allowed to step
                if((<HTMLInputElement>document.getElementById("steptoggle")).checked && canStep==true) {
                      _CPU.cycle();
                     canStep=false;
                     document.getElementById("Acc_field").innerText=""+_CPU.Acc; 
                     document.getElementById("yreg_field").innerText=""+_CPU.Yreg; 
                     document.getElementById("xreg_field").innerText=""+_CPU.Xreg; 
                     document.getElementById("zflag_field").innerText=""+_CPU.Zflag;    
                     document.getElementById("pc_field").innerText=""+_CPU.PC+"("+_CPU.curPCB.baseRegister+_CPU.PC+")";
                     //update dispaly of pcbs so the user can see 
                     document.getElementById("pcbs_PC"+_CPU.curPCB.Pid).innerText=""+_CPU.PC;
                //update the cpu dispaly so you can see the instruction being read
                     document.getElementById("instr_field").innerText=_CPU.instruction;
                }



                //else if we are in step mode and are not allowed to step 
                else if ((<HTMLInputElement>document.getElementById("steptoggle")).checked && canStep==false ){
                    this.krnTrace("Idle");
                }
                else if (!(<HTMLInputElement>document.getElementById("steptoggle")).checked ){
                    _CPU.cycle()
                    //update display
                    document.getElementById("Acc_field").innerText=""+_CPU.Acc; 
                    document.getElementById("yreg_field").innerText=""+_CPU.Yreg; 
                    document.getElementById("xreg_field").innerText=""+_CPU.Xreg;
                    document.getElementById("zflag_field").innerText=""+_CPU.Zflag;    
                    document.getElementById("pc_field").innerText=""+_CPU.PC;

                   //update dispaly of pcbs so the user can see 

                 //   document.getElementById("pcbs_PC"+_CPU.curPCB.Pid).innerText=""+_CPU.PC;
                    //update the cpu dispaly so you can see the instruction being read
                    document.getElementById("instr_field").innerText=_CPU.instruction;
                                     }
                           
            }



             else {                      // If there are no interrupts and there is nothing being executed then just be idle. {
                this.krnTrace("Idle");
            }

        }


        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }

        public krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();              // Kernel built-in routine for timers (not the clock).
                    break;
                    case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);   // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                //case CONTEXT_SWITCH:
                    //implement CPU Scheduler to handle context swtich to end a process and deque the running queue 
                    default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
                }
            }

            public krnTimerISR() {
                 _Scheduler.callScheduler();
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        }

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile


        //
        // OS Utility Routines
        //
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                 if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
            }
        }

        public krnTrapError(msg) {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            var ctx = _Canvas.getContext("2d");
            _StdOut.clearScreen();
            _StdOut.resetXY();
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.fillRect(0,0,500,500);
            ctx.fill();
            _StdOut.putText("An error has occured, you broke something.");
            
            
            this.krnShutdown();
        }
        
    }
}
