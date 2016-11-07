
module TSOS {
//pcb object
export class Pcb {
  constructor(
    public Pid: number = 0,                   
    public PC: number=0,
    public Acc: number=0,
    public Xreg: number = 0,
    public Yreg: number = 0,
    public Zflag: number = 0,
    public isExecuting: boolean = false,
    public logicaladdress: number= null,
    public baseRegister: number = -1,
    public limitRegister: number = -1) {

  }
        //funciton to update your current pcb with new values taken from the cpu
        public updatePcb(newPC,newAcc,newXreg,newYreg,newZflag){
          _CPU.curPCB.PC=newPC;
          _CPU.curPCB.Acc=newAcc;
          _CPU.curPCB.Xreg=newXreg;
          _CPU.curPCB.Yreg=newYreg;
          _CPU.curPCB.Zflag=newZflag;
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