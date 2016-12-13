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

            if( fileName.length<60){
                var hexaddress=sessionStorage.getItem("000").substr(4);
              
                var decaddress="";
                var hexName="1000";    
                for(var i=0;i<hexaddress.length;i+=2){
                    decaddress+=String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16));
                }
                for(var i=0;i<fileName.length;i++){
                    hexName+= parseInt(fileName.charAt(i),16);
                } 
                while(hexName.length<124){
                    hexName+="0";
                }
                sessionStorage.setItem(decaddress.substr(0,3),hexName);
                var newBase="";
                if(decaddress.charAt(2)=="7"){
                    if(decaddress.charAt(1)=="7"){
                        if(decaddress.charAt(0)=="3"){

                        }
                        else{
                               newBase=""+(parseInt(decaddress.charAt(0))+1)+0+0;
                        }

                    }
                    else{
                         newBase=""+decaddress.charAt(0)+(parseInt(decaddress.charAt(1))+1)+0
                    }

                }
                else{
                     newBase=""+decaddress.charAt(0)+decaddress.charAt(1)+(parseInt(decaddress.charAt(2))+1)
                }

                var finalBase=sessionStorage.getItem("000").substr(0,4);

                for(var i=0;i<newBase.length;i++){
                    finalBase+=newBase.charCodeAt(i).toString(16);
                }
                
                for(var i=0;i<decaddress.substr(3).length;i++){
                   finalBase+=decaddress.substr(3).charCodeAt(i).toString(16);
                }
                while(finalBase.length<124){
                    finalBase+="0"

                }
               
                sessionStorage.setItem("000",finalBase);
                this.updateDiskDisplay();
            }
            else{
                _StdOut.putText("The name that you supplied is too long.",true);
               
            }
        }

        public updateDiskDisplay(){
            
            var hardDriveDisplay="";
            var hardDriveValues="";
             var active="";
             var pointer="";
             var data="";
            for(var i=0;i<=3;i++){
                for(var j=0;j<=7;j++){
                    for(var k=0; k<=7;k++){
                            hardDriveValues=sessionStorage.getItem(""+i+j+k)
                            active=hardDriveValues.substr(0,1)
                         
                            pointer=hardDriveValues.substr(1,3)
                            
                            data=hardDriveValues.substr(4)

                            hardDriveDisplay+="<tr id=\"hdRow"+i+j+k+"\"><td id=\"registerNum\">"+i+":"+j+":"+k+"</td><td id=\"activeFlag\">"+active+"</td><td id=\"hdPointer\">"+pointer+"</td><td id=\"data\">"+data+"</td>";

                    }
                }

            }
            
          
            document.getElementById("hardDriveTable").innerHTML=hardDriveDisplay;
            alert("wowzer")

        }

        public writeToDrive(fileName,writenData){
            var searchPointer="000";
            while(searchPointer!="100"){
               
                sessionStorage.getItem(searchPointer);

                searchPointer=this.searchPointerIncrement(searchPointer);

            }
        }

        public searchPointerIncrement(pointer){
            var hexPoint=""
            for(var i=0;i<pointer.length;i++){
                    hexPoint+= parseInt(fileName.charAt(i),16);
             }
            var newBase="";
            if(pointer.charAt(2)=="7"){
                    if(pointer.charAt(1)=="7"){
                        if(pointer.charAt(0)=="3"){

                        }
                        else{
                               newBase=""+(parseInt(pointer.charAt(0))+1)+0+0;
                        }

                    }
                    else{
                         newBase=""+pointer.charAt(0)+(parseInt(pointer.charAt(1))+1)+0
                    }

                }
                else{
                     newBase=""+pointer.charAt(0)+pointer.charAt(1)+(parseInt(pointer.charAt(2))+1)
                }
                return newBase;
        }

        }


    }




    }

