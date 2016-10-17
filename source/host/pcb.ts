
module TSOS {

    export class Pcb {
         constructor(
                    public Pid: number = 0,                   
                    public PC: number=0,
                    public Acc: number=0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }
        public updatePcb(newPC,newAcc,newXreg,newYreg,newZflag){
          this.PC=newPC;
          this.Acc=newAcc;
          this.Xreg=newXreg;
          this.Yreg=newYreg;
          this.Zflag=newZflag;
        }
    	 // PC: number;
      //    PCID:number;
      //    Acc: number;
      //    Xreg: number;
      //    Yreg: number;
      //    Zflag: number;
      //    isExecuting: boolean;

    	// constructor(newPC:number,newAcc:number,newXreg:number,newYreg:number,newZflag:number,newExecuting:boolean){ 
    	// 			this.PC=newPC;
    	// 			this.Acc=newAcc;
    	// 			this.Xreg=newXreg;
    	// 			this.Yreg=newYreg;
    	// 			this.Zflag=newZflag;
    	// 			this.isExecuting=newExecuting;

     //  	}


	

    }
}