var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.memPoint = 0;
            this.memory = [];
            for (var i = 0; i < 767; i++) {
                this.memory.push("00");
            }
        }
        Memory.prototype.memoryUpdate = function (newValue) {
            this.memory[this.memPoint] = newValue;
            document.getElementById("cell" + this.memPoint).innerText = newValue;
            this.memPoint++;
        };
        //function to get values from memory and convert them to dec
        Memory.prototype.getFromMemory = function (index) {
            var tarReg = parseInt(index, 16);
            // alert("get from mem tarReg ="+tarReg)
            // alert("value at index = "+this.memory[tarReg])
            return parseInt(this.memory[tarReg], 16);
        };
        Memory.prototype.clearAllMemory = function () {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
                this.memPoint = 0;
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
