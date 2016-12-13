
module TSOS {
    //memory of the host
    export class HardDrive {
     
        
        constructor(){
           
        }

        public initHardDriveTable(){
            
            var hardDriveDisplay="";
             sessionStorage.clear();
            for(var i=0;i<=3;i++){
                for(var j=0;j<=7;j++){
                    for(var k=0; k<=7;k++){
                        if(i==0&&j==0&&k==0){
                            hardDriveDisplay+="<tr id=\"hdRow"+i+j+k+"\"><td id=\"registerNum\">"+i+":"+j+":"+k+"</td><td id=\"activeFlag\">0</td><td id=\"hdPointer\">000</td><td id=\"data\">3030313130300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</td>";
                            sessionStorage.setItem(''+i+''+j+''+k,"1000303031313030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");

                        }
                        else{
                            hardDriveDisplay+="<tr id=\"hdRow"+i+j+k+"\"><td id=\"registerNum\">"+i+":"+j+":"+k+"</td><td id=\"activeFlag\">0</td><td id=\"hdPointer\">000</td><td id=\"data\">0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</td>";
                            sessionStorage.setItem(''+i+''+j+''+k,"0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
                        }
                        
                    }
                }

            }
            
          
            document.getElementById("hardDriveTable").innerHTML=hardDriveDisplay;
            

        }

        

         

         
     }
 }

