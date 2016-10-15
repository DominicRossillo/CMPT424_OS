var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.memPoint = 0;
            for (var i = 0; i < 767; i++) {
                this.memory = [];
                this.memory.push("00");
            }
        }
        Memory.prototype.memoryUpdate = function (newValue) {
            this.memory[this.memPoint] = newValue;
            this.memPoint++;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
