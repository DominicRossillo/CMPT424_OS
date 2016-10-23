var TSOS;
(function (TSOS) {
    //memory of the host
    var Memory = (function () {
        function Memory() {
            this.memPoint = 0;
            this.memory = [];
            for (var i = 0; i < 767; i++) {
                this.memory.push("00");
            }
        }
        //function to update the memory and display it properly 
        Memory.prototype.memoryUpdate = function (newValue, address) {
            _Memory.memory[address] = newValue;
            document.getElementById("cell" + address).innerText = newValue;
            _Memory.memPoint++;
        };
        //function to get values from memory and convert them to dec
        Memory.prototype.getFromMemory = function (index) {
            var tarReg = parseInt(index, 16);
            // alert("get from mem tarReg ="+tarReg)
            // alert("value at index = "+_Memory.memory[tarReg])
            return parseInt(_Memory.memory[tarReg], 16);
        };
        //function to set all values in mem to 00
        Memory.prototype.clearAllMemory = function () {
            for (var i = 0; i < _Memory.memory.length; i++) {
                _Memory.memory[i] = "00";
                document.getElementById("cell" + i).innerText = "00";
            }
            _Memory.memPoint = 0;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
