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
            _HardDrive.initHardDriveTable();

            // More?
             
        }
        //used by format command. simply reinitializes the hard drive
        public formatHardDrive(){
            _HardDrive.initHardDriveTable()

        }
        //create file takes in a file name given by user and a bool. bool is used as a flag for knowing when users
        //are creating a file that is going to be used for cpu calcumations and stuff
        public createFile(fileName,bool){
            var searchPointer="000";
            var checkName=fileName
            var nameAvalible=true;
            var trueName=""
           
           //makes sure name is 120 chars long to check if it already exist on hard drive

            while(checkName.length<120){
                    checkName+="0"

            }
            //searching if name exist already
            while(searchPointer!="100"){
                      
                var hexName=sessionStorage.getItem(searchPointer);
               
                  //if its found we return an error
                if(checkName==hexName.substr(4)){
                        
                    nameAvalible=false;
                    break
                }
                else{
                    searchPointer=this.searchPointerIncrement(searchPointer);
                }
            }
            //ut the inputed name into hex
            for(var i=0; i<fileName.length;i=i+2){

                trueName+=String.fromCharCode(parseInt(fileName.substr(i, 2), 16));
            }

            if(fileName.charAt(0)!=null && (nameAvalible||bool)){
                //if the file name is too long you get an error
                if( fileName.length<60){
                    //taking sub string of hex addres in our bsae register 
                    //sub string leaves out the active and pointer fields taht are not needed
                    var hexaddress=sessionStorage.getItem("000").substr(4);
                  
                    var decaddress="";
                    var hexName="1";
                    var pointerRef="" 
                    //turning the hexaddress into hex characters to store in the file name registers   
                    for(var i=0;i<hexaddress.length;i+=2){
                        decaddress+=String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16));
                    }
                    for(var i=0;i<decaddress.substr(3,3).length;i++){
                        
                        hexName+=parseInt(decaddress.substr(3,3).charAt(i));
                        pointerRef+=parseInt(decaddress.substr(3,3).charAt(i));
                    }
                    
                    for(var i=0;i<fileName.length;i++){
                       
                        hexName+= fileName.charAt(i).toString(16)
                    } 
                    while(hexName.length<124){
                        hexName+="0";
                    }
                    //assign the name and pointer values to the designated file location
                    sessionStorage.setItem(decaddress.substr(0,3),hexName);
                    var newBaseHead="";
                    var newBaseTail="";
                    var memoryInit="1000"
                    //all below is used to increment base register
                    while(memoryInit.length<124){
                        memoryInit+="0"
                    }
                   
                    newBaseHead=this.searchPointerIncrement(decaddress.substr(0,3));
                    newBaseTail=this.searchPointerIncrement(decaddress.substr(3));
                   

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
                    _StdOut.putText("File Create: "+trueName);
                    this.updateDiskDisplay();
                }
                else{
                    
                    _StdOut.putText("The name that you supplied is too long.",true);
                    
                }
            }
            else{
                if(!nameAvalible){

                    _StdOut.putText("The name that you supplied is already being used.",true);
                }
                else{
                _StdOut.putText("You must supply a file name.",true);
                }
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
           

        }
        //writes files to drive using a file name from user and data from user.
        public writeToDrive(fileName,writenData){
           
          
                var searchPointer="000";
               
                var hexName="";
                //search for the file name and then take its 1-3 substring which is its pointer to where data goes
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
                    destReg+=String.fromCharCode(parseInt(saveReg.substr(i, 2), 16))
                }
                   
                //.replace(/[^a-zA-Z0-9]/g, "");
                //our name of the file that we use to check if it exists
                var ourName="";
                for(var i=0;i<fileName.length;i++){
                    ourName+= fileName.charCodeAt(i).toString(16);
                        
                } 

                 while(ourName.length<120){
                        ourName+="0"

                 }
                 //does it exist
                while(searchPointer!="101"){
                      
                    var hexName=sessionStorage.getItem(searchPointer);

                    if(searchPointer=="100"){
                        _StdOut.putText("File with that name does not exist.",true);
                    }
                    //if we find the name
                    if(ourName==hexName.substr(4)){
                        //asing the pointer to a future register to regpoit. this is only used if the code we put in is >120
                        var regPoint=sessionStorage.getItem(searchPointer).substr(1,3);
                        var initPoint="1000"
                        if(programInput.length>120){
                            //if the data we put in is >120
                            var baseAddress=""
                            var hexAddress=sessionStorage.getItem("000").substr(4)
                            for(var i=0;i<hexAddress.length;i+=2){
                                baseAddress+=String.fromCharCode(parseInt(hexAddress.substr(i, 2), 16));
                            }
                              //we set the initPoint to the next file space
                            initPoint="1"+baseAddress.substr(3)
                            this.bigWriteToDrive(initPoint.substr(1,3),programInput.substr(120))
                            var hexaddress= sessionStorage.getItem("000").substr(4)
                            var finalBase=sessionStorage.getItem("000").substr(0,4);
                            var destReg="1000"
                            //start to increment our base register values
                            var decaddress=""
                             for(var i=0;i<hexaddress.length;i+=2){
                                decaddress+=String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16));
                            }
                            var newBaseHead=decaddress.substr(0,3)
                            var newBaseTail=this.searchPointerIncrement(decaddress.substr(3));

                            for(var i=0;i<newBaseHead.length;i++){
                                finalBase+=newBaseHead.charCodeAt(i).toString(16);
                            }
                            for(var i=0;i<newBaseHead.length;i++){
                                finalBase+=newBaseTail.charCodeAt(i).toString(16);
                            }               
                    
                            while(finalBase.length<124){
                                finalBase+="0"

                            }
                             sessionStorage.setItem("000",finalBase);

                        }
                        var oldData=sessionStorage.getItem(searchPointer).substr(4);
                        sessionStorage.setItem(searchPointer,"1"+regPoint+oldData);
                        sessionStorage.setItem(regPoint,initPoint+programInput.substr(0,120));
                        _StdOut.putText("File: "+fileName+" has been written to.");
                        _StdOut.advanceLine();
                        break;
                    }
                    else{
                        searchPointer=this.searchPointerIncrement(searchPointer);
                    }
                }        
                    this.updateDiskDisplay();
        }

        //if we write a file that is greate than 120
        public bigWriteToDrive(pointer,data){
            var hexaddress= sessionStorage.getItem("000").substr(4)
            var finalBase=sessionStorage.getItem("000").substr(0,4);
            var destReg="1000"
            var decaddress=""
             for(var i=0;i<hexaddress.length;i+=2){
                        decaddress+=String.fromCharCode(parseInt(hexaddress.substr(i, 2), 16));
                    }
            var newBaseHead=decaddress.substr(0,3)
            var newBaseTail=this.searchPointerIncrement(decaddress.substr(3));

            for(var i=0;i<newBaseHead.length;i++){
                finalBase+=newBaseHead.charCodeAt(i).toString(16);
            }
            for(var i=0;i<newBaseHead.length;i++){
                finalBase+=newBaseTail.charCodeAt(i).toString(16);
            }               
                    
            while(finalBase.length<124){
                finalBase+="0"

            }
            sessionStorage.setItem("000",finalBase);
            if(data.length>120){
                destReg="1"
               
                destReg+=newBaseTail
                //recursive call for larger files
                this.bigWriteToDrive(newBaseTail,data.substr(120));



            }
            else if(data.length<120){
                while(data.length<120){
                    data+="0"
                
                }
            }
            
            sessionStorage.setItem(pointer,destReg+data.substr(0,120));
            this.updateDiskDisplay();

        }
        //util to increment my base and search pointers 
        public searchPointerIncrement(pointer){
            
            var newBase="";
            if(pointer.charAt(2)=="7"){
                    if(pointer.charAt(1)=="7"){
                        if(pointer.charAt(0)=="3"){
                           _StdOut.putText("Out of memory.")
                        }
                        else{
                               newBase=""+(parseInt(pointer.charAt(0))+1)+""+0+""+0;
                        }

                    }
                    else{
                         newBase=""+pointer.charAt(0)+""+(parseInt(pointer.charAt(1))+1)+""+0
                    }

                }
                else{
                     newBase=""+pointer.charAt(0)+pointer.charAt(1)+(parseInt(pointer.charAt(2))+1)
                }
                return newBase;
        }

        //ls function 
        public hardDriveLs(){
            var searchPointer="001"
            var nullresult=""
            //create nullresult string of 120 0 to make sure to not include them when user calls ls
            while(nullresult.length<120){
                nullresult+="0"
            }
            while(searchPointer!="100"){
                    var fileName=""; 
                    var hexName=sessionStorage.getItem(searchPointer).substr(4);
                    //if we find an item that is not nullresult we will translate it and print it oout for the user
                    if(hexName!=nullresult){
                        for(var i=0;i<hexName.length;i=i+2){
                            fileName+=String.fromCharCode(parseInt(hexName.substr(i, 2), 16))
                        }
                        
                        if(true){
                            _StdOut.putText("Ls: "+fileName,true);
                            _StdOut.advanceLine();
                        }
                    }
                    
                    searchPointer=this.searchPointerIncrement(searchPointer);
                    
                }   

        }
        //read file
        public readFile(fileName){
            var searchPointer="000";
            var checkName=fileName
            var nameAvalible=true;
            var trueName=""
               //check if file exists
            for(var i=0;i<fileName.length;i=i+2){
                            trueName+=String.fromCharCode(parseInt(fileName.substr(i, 2), 16))
            }

            while(checkName.length<120){
                    checkName+="0"

            }
            while(searchPointer!="101"){
                      
                var hexName=sessionStorage.getItem(searchPointer);
                if(searchPointer=="100"){
                     _StdOut.putText("No file with that name exists",true);
                    
                    break
                }
              
                if(checkName==hexName.substr(4)){
                    //if we find the file we want to 
                    var hexData= sessionStorage.getItem(hexName.substr(1,3)).substr(4);
                    var hexPoint=hexName.substr(1,3);
                    var translatedData=""
                    //while loop to reference any pointers that the file leads to. once we find 000 we know we are done looping
                    while(hexPoint!="000"){
                        
                        for(var i=0;i<hexData.length;i=i+2){
                            translatedData+=String.fromCharCode(parseInt(hexData.substr(i, 2), 16))
                        }
                        hexPoint=sessionStorage.getItem(hexPoint).substr(1,3)
                    }
                    _StdOut.putText(trueName+": "+translatedData,true);
                    break
                }
                else{
                    searchPointer=this.searchPointerIncrement(searchPointer);
                }
            }

        }
        //delete file function
        public deleteFile(fileName){
            var searchPointer="000";
            var checkName=fileName
            var nameAvalible=true;
            var trueName=""
           
            for(var i=0;i<fileName.length;i=i+2){
                trueName+=String.fromCharCode(parseInt(fileName.substr(i, 2), 16))
            }

            while(checkName.length<120){
                checkName+="0"

            }
            //search if exists
            while(searchPointer!="101"){
                      
                var hexName=sessionStorage.getItem(searchPointer);
                if(searchPointer=="100"){
                     _StdOut.putText("No file with that name exists",true);
                    
                    break;
                }
                  //when we find it we start to set all values tied to the original file name to 0
                if(checkName==hexName.substr(4)){
                    var savePointer=searchPointer;
                    if(sessionStorage.getItem(searchPointer).charAt(0)=="1"){
                        this.deletePointer((sessionStorage.getItem(searchPointer)).substr(1,3));
                        //reset the pointer so we can continue to delete things pointed to
                        searchPointer=sessionStorage.getItem(searchPointer).substr(1,3)

                    }
                    var clearLoc= hexName.substr(1,3)
                    
                    var newReg="";
                    while(newReg.length<124){
                        newReg+="0"
                    }
                    sessionStorage.setItem(clearLoc,newReg)
                    sessionStorage.setItem(savePointer,newReg)
                    _StdOut.putText(trueName+" has been deleted from disk.",true);
                    
                    break;
                }
                else{
                    searchPointer=this.searchPointerIncrement(searchPointer);
                }
            }
            this.updateDiskDisplay();
        }
        //function to keep track of linked locations to delete
        public deletePointer(pointer){
            var clearLoc= pointer
            while(clearLoc!="000"){
                var nextLoc=(sessionStorage.getItem(clearLoc).substr(1,3))
                    
                var newReg="";
                while(newReg.length<124){
                    newReg+="0"
                }
                sessionStorage.setItem(clearLoc,newReg)
                clearLoc=nextLoc
            }
        }
        //function used to swap memory from disk to main memory
        public swapMem(fileRegister,base,limit){

            var memoryInput=""
            var filePoint=fileRegister
            //while loop to read all original code from disk to make into our memory translate
            while(filePoint!="000"){
                var memoryTranslate=""
                var hexMemory=sessionStorage.getItem(filePoint)
               
                for(var i=0;i<hexMemory.length;i=i+2){
                    memoryTranslate+=String.fromCharCode(parseInt(hexMemory.substr(i, 2), 16))
                }
                
                memoryInput+=(memoryTranslate.replace(/[^a-zA-Z0-9]/g, ""))
                
                filePoint=sessionStorage.getItem(filePoint).substr(1,3)
                
            }
            //get rid of starting 5 chars to get rid of the file name
            var memoryInput=memoryInput.substr(5)
            var memArr=[]
            for(i=0; i<memoryInput.length;i=i+2){
                memArr.push(""+memoryInput.substr(i,2))
            }
            
            var j=0;
            //start loading the data in to main memory. if theere is room left for data we fill it with 0s
            for(var i =parseInt(base);i<parseInt(limit);i++,j++){
                if(j>=memArr.length){
                    _Memory.memoryUpdate("00",i)
                }
                else{
                    var curElement=memArr[j]
                  
                    if((curElement.length)<2){
                         _Memory.memoryUpdate(memArr[j]+"0",i)
                    }
                    else{
                         _Memory.memoryUpdate(memArr[j],i)
                    }
               
                }
            }

        }

        


    }




    }

//dad?