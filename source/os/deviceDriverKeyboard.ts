///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            
            var chr = "";
            //checks for caps lock if so invert current isShifted
            if(capsLock){
                isShifted=!isShifted
            }
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123) )) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
               
                _KernelInputQueue.enqueue(chr);
            } 

            else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                   ||   // space
                        (keyCode == 13)) {                     // enter
                chr = String.fromCharCode(keyCode);

                //!
                 if (isShifted) {
                 
                     if (keyCode == 49){
                 
                        chr = String.fromCharCode(33);
                    }
                    //@
                     else if (keyCode == 50) {
                        chr = String.fromCharCode(64);
                    }
                    //#
                     else if (keyCode == 51) {
                        chr = String.fromCharCode(35);
                    }
                    //$
                     else if (keyCode == 52) {
                        chr = String.fromCharCode(36);
                    }
                    //%
                     else if (keyCode == 53) {
                        chr = String.fromCharCode(37);
                    }
                     //^
                     else if (keyCode == 54) {
                        chr = String.fromCharCode(94);
                    } //&
                     else if (keyCode == 55 && !usearrow) {
                        chr = String.fromCharCode(38);
                    }
                    //*
                     else if (keyCode == 56) {
                        chr = String.fromCharCode(42);
                    }
                    //(
                     else if (keyCode == 57 && !usearrow) {
                        chr = String.fromCharCode(40);

                    }
                    //) 
                     else if (keyCode == 48) {
                        chr = String.fromCharCode(41);
                    }
                      
               }
               _KernelInputQueue.enqueue(chr); 
             
            }    
                //delete/backspace
                else if (keyCode==8){
                 
                 chr = String.fromCharCode(keyCode);
                 _KernelInputQueue.enqueue(chr);

                }
                //tabcomplete    
                  else if (keyCode==9){
                 
                 chr = String.fromCharCode(keyCode);
                 _KernelInputQueue.enqueue(chr);

                }
                //capslock
                   else if (keyCode==20){
                 
                 capsLock=!capsLock;

                }
                  //up arrow and down arrow  
                  else if ((keyCode==38 ||keyCode ==40)&& !usearrow){
                 usearrow=true;
                 chr = String.fromCharCode(keyCode);
                 _KernelInputQueue.enqueue(chr);

                }

           
             else {                      
                chr = String.fromCharCode(keyCode);
                
                 if (isShifted) {
                   //~
                     if (keyCode == 192){
                 
                        chr = String.fromCharCode(126);
                    }
                    //_
                     else if (keyCode == 189) {
                        chr = String.fromCharCode(95);
                    }
                    //+
                     else if (keyCode == 187) {
                        chr = String.fromCharCode(43);
                    }
                    //{
                     else if (keyCode == 219) {
                        chr = String.fromCharCode(123);
                    }
                    //}
                     else if (keyCode == 221) {
                        chr = String.fromCharCode(125);
                    }
                     // |
                     else if (keyCode == 220) {
                        chr = String.fromCharCode(124);
                    } //:
                     else if (keyCode == 186) {
                        chr = String.fromCharCode(58);
                    }
                    //"
                     else if (keyCode == 222) {
                        chr = String.fromCharCode(34);
                    }
                    //<
                     else if (keyCode == 188) {
                        chr = String.fromCharCode(60);
                    }
                    //>
                     else if (keyCode == 190) {
                        chr = String.fromCharCode(62);
                    }
                    //?
                     else if (keyCode == 191) {
                        chr = String.fromCharCode(63);
                    }
                   
                }


                    //non shitfted chars
                        else {
                        //`
                        if (keyCode == 192){
                     
                            chr = String.fromCharCode(96);
                        }
                        //-
                         else if (keyCode == 189) {
                            chr = String.fromCharCode(45);
                        }
                        //=
                         else if (keyCode == 187) {
                            chr = String.fromCharCode(61);
                        }
                        //[
                         else if (keyCode == 219) {
                            chr = String.fromCharCode(91);
                        }
                        //]
                         else if (keyCode == 221) {
                            chr = String.fromCharCode(93);
                        }
                         // \
                         else if (keyCode == 220) {
                            chr = String.fromCharCode(92);
                        } //;
                         else if (keyCode == 186) {
                            chr = String.fromCharCode(59);
                        }
                        //'
                         else if (keyCode == 222) {
                            chr = String.fromCharCode(39);
                        }
                        //,
                         else if (keyCode == 188) {
                            chr = String.fromCharCode(44);
                        }
                        //.
                         else if (keyCode == 190) {
                            chr = String.fromCharCode(46);
                        }
                        // /
                         else if (keyCode == 191) {
                            chr = String.fromCharCode(47);
                        }
                       
                    }
              _KernelInputQueue.enqueue(chr);
               }
              
                
            }
         
        }
    }

