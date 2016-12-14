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
                var hexName="1";
                var pointerRef=""    
                for(var i=0;i<hexaddress.length;i+=2){
                    decaddress+=String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16));
                }
                for(var i=0;i<decaddress.substr(3,3).length;i++){
                    hexName+=parseInt(decaddress.substr(3,3).charAt(i));
                    pointerRef+=parseInt(decaddress.substr(3,3).charAt(i));
                }
                
                for(var i=0;i<fileName.length;i++){
                    hexName+= parseInt(fileName.charAt(i),16);
                } 
                while(hexName.length<124){
                    hexName+="0";
                }
                sessionStorage.setItem(decaddress.substr(0,3),hexName);
                var newBaseHead="";
                var newBaseTail="";
                var memoryInit="1000"
                while(memoryInit.length<124){
                    memoryInit+="0"
                }
               
                newBaseHead=this.searchPointerIncrement(decaddress.substr(0,3));
                newBaseTail=this.searchPointerIncrement(decaddress.substr(3));
                alert("new base head"+newBaseHead)
               

                var finalBase=sessionStorage.getItem("000").substr(0,4);

                for(var i=0;i<newBaseHead.length;i++){
                    finalBase+=newBaseHead.charCodeAt(i).toString(16);
                }
                for(var i=0;i<newBaseHead.length;i++){
                    finalBase+=newBaseTail.charCodeAt(i).toString(16);
                }
                
                
                while(finalBase.length<124){
                    finalBase+="0"

                }
                sessionStorage.setItem(pointerRef,memoryInit);
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
           
            var hexName="";
            for(var i=0;i<fileName.length-1;i++){
                hexName+= parseInt(fileName.charAt(i),16);
            }
            var programInput="";
            for(var i=0;i<writenData.length;i++){
                programInput+= writenData.charCodeAt(i).toString(16);
            }
            while(programInput.length<120){
                programInput+="0"
            }
            var saveReg=sessionStorage.getItem("000").substr(4)
            
            var destReg="";
            for(var i=0;i<saveReg.length;i++){
                destReg+=String.fromCharCode(parseInt(saveReg.substr(i, 2), 16)).replace(/[^a-zA-Z0-9]/g, "");
            }
               
                
                alert(destReg)
                alert(regPoint)



            var ourName="";
            for(var i=0;i<fileName.length;i++){
                    ourName+= fileName.charCodeAt(i).toString(16);
                    
             } 

             while(ourName.length<120){
                    ourName+="0"

             }

            while(searchPointer!="100"){
                  
                var hexName=sessionStorage.getItem(searchPointer);

                if(ourName==hexName.substr(4)){
                    alert("found it")
                    var regPoint=sessionStorage.getItem(searchPointer).substr(1,3);
                    var oldData=sessionStorage.getItem(searchPointer).substr(4);
                    sessionStorage.setItem(searchPointer,"1"+regPoint+oldData);
                    sessionStorage.setItem(regPoint,"1000"+programInput);
                    break;
                }
                else{
                    searchPointer=this.searchPointerIncrement(searchPointer);
                }
            }    
                // var startBase=sessionStorage.getItem("000")
                // var baseTail=startBase.substr(4);
                // var decBase=""
                // for(var i=0;i<baseTail.length;i++){
                //    decBase+=String.fromCharCode(parseInt(baseTail.substr(i, 2), 16))
                // }
                // var newFileLoc=""+parseInt(decBase.substr(3))+1;
                // var finalBase=sessionStorage.getItem("000").substr(0,4);
                // for(var i=0;i<newFileLoc.length;i++){
                //    finalBase+=newFileLoc.charCodeAt(i).toString(16);
                // }
                // while(finalBase.length<124){
                //     finalBase+="0"
                // }
                

               
                
                
               
                // sessionStorage.setItem("000",finalBase);
                this.updateDiskDisplay();
        }

        public searchPointerIncrement(pointer){
            
            var newBase="";
            if(pointer.charAt(2)=="7"){
                    if(pointer.charAt(1)=="7"){
                        if(pointer.charAt(0)=="3"){
                            //todo: make error statemetn
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

