var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
        }
        memoryManager.prototype.clearMemory = function () {
            _Memory.clearAllMemory();
        };
        memoryManager.prototype.memoryUpdate = function (newValue) {
            _Memory.memory[_Memory.memPoint] = newValue;
            document.getElementById("cell" + _Memory.memPoint).innerText = newValue;
            _Memory.memPoint++;
        };
        //function to get values from memory and convert them to dec
        memoryManager.prototype.getFromMemory = function (index) {
            var tarReg = parseInt(index, 16);
            // alert("get from mem tarReg ="+tarReg)
            // alert("value at index = "+_Memory.memory[tarReg])
            return parseInt(_Memory.memory[tarReg], 16);
        };
        memoryManager.prototype.clearAllMemory = function () {
            for (var i = 0; i < _Memory.memory.length; i++) {
                _Memory.memory[i] = "00";
                _Memory.memPoint = 0;
            }
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
