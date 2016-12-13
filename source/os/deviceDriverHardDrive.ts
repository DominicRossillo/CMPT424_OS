///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

   module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverHardDrive extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();

            this.driverEntry = this.krnHdDriverEntry;
             
           
           
        }
         public krnHdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
      

         public initHardDrive(){
              // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            // alert("in init hd table")
            _HardDrive.initHardDriveTable();
            // More?
             
        }
        public formatHardDrive(){
            _HardDrive.initHardDriveTable()

        }
        public createFile(fileName){
            var hexaddress=sessionStorage.getItem("000");
            alert("hexaddress "+hexaddress)
            var decaddress="";
            var hexName="";    
            for(var i=0;i<hexaddress.length;i++){
                decaddress+=String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16)).substr(0,3);
            }
            for(var i=0;i<fileName.length;i++){
                hexName+= fileName.charCodeAt(i).toString(16);
            } 
            alert(decaddress);
            alert(decaddress.substr(0,3))
            sessionStorage.setItem(decaddress.substr(0,3),hexName);
            alert("hexname is"+hexName)
            this.updateDiskDisplay;
        }

        public updateDiskDisplay(){
            
            var hardDriveDisplay="";
             
            for(var i=0;i<=3;i++){
                for(var j=0;j<=7;j++){
                    for(var k=0; k<=7;k++){
                        
                            hardDriveDisplay+="<tr id=\"hdRow"+i+j+k+"\"><td id=\"registerNum\">"+i+":"+j+":"+k+"</td><td id=\"activeFlag\">0</td><td id=\"hdPointer\">000</td><td id=\"data\">"+sessionStorage.getItem(""+i+j+k)+"</td>";

                    }
                }

            }
            
          
            document.getElementById("hardDriveTable").innerHTML=hardDriveDisplay;
            alert("wowzer")

        }


    }




    }

